document.addEventListener('DOMContentLoaded', function () {
    const createUserButton = document.getElementById('createUserButton');
    const createUserForm = document.getElementById('createUserForm');
    const userListDiv = document.getElementById('user-list'); // Corrected ID

    // Event listener for the "Create User" button
    createUserButton.addEventListener('click', function () {
        createUserForm.style.display = 'block'; // Display the create user form
    });

    // Event listener for the create user form submission
    document.getElementById('createForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert("User created successfully");
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("The user with this email-id is already registered please use another email id ");
        });
    });
})