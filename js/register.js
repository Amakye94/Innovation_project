document.getElementById('doctor-register').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form values
    const doctorId = document.getElementById('doctor-id').value.trim();
    const doctorName = document.getElementById('doctor-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (!doctorId || !doctorName || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // Hash the password using bcrypt.js
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Store doctor data (replace with backend API call in production)
    const doctorData = {
        doctorId,
        doctorName,
        email,
        password: hashedPassword // Store hashed password
    };

    // For demo purposes, store in localStorage
    let doctors = JSON.parse(localStorage.getItem('doctors')) || [];
    doctors.push(doctorData);
    localStorage.setItem('doctors', JSON.stringify(doctors));

    alert('Doctor registered successfully!');
    // Optionally, redirect to a login page
    window.location.href = 'login.html';
});
