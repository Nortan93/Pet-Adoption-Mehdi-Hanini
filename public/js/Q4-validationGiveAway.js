document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('giveaway-form');
    const errorElement = document.getElementById('form-error');
    const successElement = document.getElementById('form-success');

    form.addEventListener('submit', (event) => {
        // Clear previous messages
        errorElement.textContent = '';
        successElement.textContent = '';

        // Validate fields
        let isValid = true;
        const fields = ['pet-type', 'pet-breed', 'pet-age', 'pet-gender', 'owner-name', 'owner-email'];
        fields.forEach(id => {
            const field = document.getElementById(id);
            if (!field.value || (field.type === 'checkbox' && !field.checked)) {
                isValid = false;
            }
        });

        const email = document.getElementById('owner-email').value;
        if (!validateEmail(email)) {
            isValid = false;
            errorElement.textContent = 'Please enter a valid email address.';
        }

        if (!isValid) {
            errorElement.textContent = 'Please fill out all required fields and ensure the email is valid.';
            event.preventDefault(); // Prevent form submission
        } else {
            successElement.textContent = 'Submission successful!';
            event.preventDefault(); // Prevent form from actually submitting
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
