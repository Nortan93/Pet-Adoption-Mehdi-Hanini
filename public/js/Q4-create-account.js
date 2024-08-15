
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'login.txt'); // Path to your login file

function validateCredentials(username, password) {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

    if (!usernameRegex.test(username)) {
        return { valid: false, message: 'Username can only contain letters and digits.' };
    }

    if (!passwordRegex.test(password)) {
        return { valid: false, message: 'Password must be at least 4 characters long, with at least one letter and one digit.' };
    }

    return { valid: true, message: '' };
}

async function createAccount(username, password) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading login file:', err);
                return reject({ success: false, message: 'Error reading login file.' });
            }

            const lines = data.split('\n');
            const userExists = lines.some(line => line.startsWith(username + ':'));

            if (userExists) {
                return resolve({ success: false, message: 'Username already exists. Please choose a different username.' });
            }

            fs.appendFile(filePath, `${username}:${password}\n`, err => {
                if (err) {
                    console.error('Error writing to login file:', err);
                    return reject({ success: false, message: 'Error writing to login file.' });
                }

                resolve({ success: true, message: 'Account successfully created!' });
            });
        });
    });
}




module.exports = { validateCredentials, createAccount };
