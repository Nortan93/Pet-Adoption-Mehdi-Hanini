const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const port = 3004;
const filePath = path.join(__dirname, 'login.txt');

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'CS1993', 
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('Homepage');
});

app.get('/browse-pets', (req, res) => {
    const pets = req.session.pets || []; 
    res.render('browse-pets');
});

app.get('/dog-care', (req, res) => {
    res.render('dog-care');
});

app.get('/cat-care', (req, res) => {
    res.render('cat-care');
});

app.get('/find-pet', (req, res) => {
    res.render('find-pet');
});

app.get('/create-account', (req, res) => {
    res.render('create-account', { errorMessage: null, successMessage: null });
});

app.post('/create-account', (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    const usernamePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

    let errorMessage = '';
    let successMessage = '';

    if (!usernamePattern.test(username)) {
        errorMessage = 'Username can only contain letters and digits.';
    } else if (!passwordPattern.test(password)) {
        errorMessage = 'Password must be at least 4 characters long and contain at least one letter and one digit.';
    } else {
        const loginFilePath = path.join(__dirname, 'login.txt');

        const existingUsers = fs.existsSync(loginFilePath)
            ? fs.readFileSync(loginFilePath, 'utf-8').split('\n').map(line => line.split(':')[0])
            : [];

        if (existingUsers.includes(username)) {
            errorMessage = 'Username already exists. Please choose a different username.';
        } else {
            fs.appendFileSync(loginFilePath, `${username}:${password}\n`);
            successMessage = 'Account successfully created. You can now log in.';
        }
    }

    res.render('create-account', { errorMessage, successMessage });
});

// Handle login page rendering
app.get('/pet-giveaway-login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/giveaway-pet');
    } else {
        res.render('pet-giveaway-login', { errorMessage: '' });
    }
});



app.post('/pet-giveaway-login', (req, res) => {
    const { username, password } = req.body;

    
    const loginFilePath = path.join(__dirname, 'login.txt');
    const users = fs.existsSync(loginFilePath)
        ? fs.readFileSync(loginFilePath, 'utf-8').split('\n').map(line => line.split(':'))
        : [];

    const user = users.find(([user, pass]) => user === username && pass === password);

    if (user) {
        req.session.loggedIn = true; 
        res.redirect('/giveaway-pet'); 
    } else {
        res.render('pet-giveaway-login', { errorMessage: '\nInvalid username or password.' });
    }
});


app.get('/giveaway-pet', (req, res) => {
    if (req.session.loggedIn) {
        res.render('giveaway-pet');
    } else {
        res.redirect('/pet-giveaway-login');
    }
});

app.post('/submit-pet-info', (req, res) => {
    const {
        'pet-type': petType,
        'pet-breed': petBreed,
        'pet-age': petAge,
        'pet-gender': petGender,
        'get-along-dogs': getAlongDogs,
        'get-along-cats': getAlongCats,
        'family-friendly': familyFriendly,
        'pet-comments': petComments,
        'owner-name': ownerName,
        'owner-email': ownerEmail,
        
    } = req.body;

    const petInfo = `
        Pet Type: ${petType}
        Breed: ${petBreed}
        Age: ${petAge}
        Gender: ${petGender}
        Gets Along with Dogs: ${getAlongDogs ? 'Yes' : 'No'}
        Gets Along with Cats: ${getAlongCats ? 'Yes' : 'No'}
        Family Friendly: ${familyFriendly ? 'Yes' : 'No'}
        Comments: ${petComments}
        Owner Name: ${ownerName}
        Owner Email: ${ownerEmail}
        -------------------------
    `;

    const filePath = path.join(__dirname, 'available-pet-information.txt');

    fs.appendFile(filePath, petInfo, (err) => {
        if (err) {
            console.error('Failed to save pet information:', err);
            res.render('giveaway-pet', { errorMessage: 'Failed to save pet information. Please try again.', successMessage: null });
        } else {
            res.render('giveaway-pet', { successMessage: 'Pet information successfully submitted!', errorMessage: null });
        }
    });
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/'); 
    });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

function getPetData() {
    return [
        {
            name: 'Aidi',
            breed: 'Golden Retriever',
            age: '1 year',
            gender: 'Male',
            getAlongDogs: 'Yes',
            getAlongCats: 'Yes',
            familyFriendly: 'Yes'
        },
        {
            name: 'Linux',
            breed: 'Siamese',
            age: '2 years',
            gender: 'Female',
            getAlongDogs: 'No',
            getAlongCats: 'Yes',
            familyFriendly: 'No'
        }

    ];
}

app.post('/search-pets', (req, res) => {
    const {
        animal,
        breed,
        age,
        gender,
        'other-dogs': otherDogs,
        'other-cats': otherCats,
        'small-children': smallChildren
    } = req.body;

    const petData = getPetData();

    const matchingPets = petData.filter(pet => {
        return (
            (!animal || pet.breed.toLowerCase() === animal.toLowerCase()) &&
            (!breed || pet.breed.toLowerCase().includes(breed.toLowerCase())) &&
            (!age || pet.age.toLowerCase().includes(age.toLowerCase())) &&
            (!gender || pet.gender.toLowerCase() === gender.toLowerCase()) &&
            (!otherDogs || pet.getAlongDogs.toLowerCase() === otherDogs.toLowerCase()) &&
            (!otherCats || pet.getAlongCats.toLowerCase() === otherCats.toLowerCase()) &&
            (!smallChildren || pet.familyFriendly.toLowerCase() === smallChildren.toLowerCase())
        );
    });


    req.session.pets = matchingPets; 

    console.log('Matching Pets:', matchingPets);

    if (matchingPets.length > 0) {
        req.session.pets = matchingPets; 
        res.json({ success: true }); 
    } else {
        res.json({ success: false }); 
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});



