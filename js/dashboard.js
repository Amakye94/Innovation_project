document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        document.getElementById('username').innerText = user.username;
        document.getElementById('password').innerText = user.password;
    } else {
        alert('No user found. Redirecting to login...');
        window.location.href = 'login.html';
    }
});
