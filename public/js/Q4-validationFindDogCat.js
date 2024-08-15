//Find a DOG/CAT page
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('findPetForm');
    const errorMessageDiv = document.getElementById('error-message');
    const successMessageDiv = document.getElementById("success-message");

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 

       
        const animal = document.getElementById('animal').value;
        const breed = document.getElementById('breed').value;
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const otherDogs = document.getElementById('other-dogs').value;
        const otherCats = document.getElementById('other-cats').value;
        const smallChildren = document.getElementById('small-children').value;

        
        if (!animal || !breed || !age || !gender || !otherDogs || !otherCats || !smallChildren) {
            errorMessageDiv.textContent = 'Please fill out all fields !';
            errorMessageDiv.style.display = 'block';
            successMessageDiv.style.display = "none";
        } else {
            
            errorMessageDiv.style.display = 'none';
            successMessageDiv.style.display = 'block';
        }
    });
});

