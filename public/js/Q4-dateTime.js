

// Function to display the current date and time with second precision
function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleString('en-US', { hour12: true });
    document.getElementById('dateTime').innerHTML = dateTimeString;
}

// Update the date and time every second
setInterval(updateDateTime, 1000);

// Initialize the date and time on page load
document.addEventListener('DOMContentLoaded', updateDateTime);


