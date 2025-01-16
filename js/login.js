document.getElementById('user-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const age = document.getElementById('password').value;

    if (username && age) {
        // Save data to localStorage
        localStorage.setItem('user', JSON.stringify({ username, password}));
        alert('User saved successfully!');
        window.location.href = 'dashboard.html';
    } else {
        alert('Please fill in all fields.');
    }
});
