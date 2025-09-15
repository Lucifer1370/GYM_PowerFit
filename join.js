document.addEventListener('DOMContentLoaded', () => {
    // Handle mobile navigation menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Handle membership option selection
    const membershipOptions = document.querySelectorAll('.membership-option');
    membershipOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            membershipOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            option.classList.add('selected');
        });
    });

    // Form validation and submission
    const registrationForm = document.querySelector('.registration-form');
    const completeRegistrationBtn = registrationForm.querySelector('.btn-primary');

    completeRegistrationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get form values
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        const goals = document.getElementById('goals').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsChecked = document.getElementById('terms').checked;
        const newsletterChecked = document.getElementById('newsletter').checked;
        
        // Get selected membership plan
        const selectedMembership = document.querySelector('.membership-option.selected h3').textContent;
        const membershipPrice = document.querySelector('.membership-option.selected .membership-price').textContent;
        
        // Form validation
        if (!fullname || !email || !phone || !dob || !gender || !goals || !password || !confirmPassword) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Password validation
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        
        // Terms and conditions check
        if (!termsChecked) {
            alert('You must agree to the Terms and Conditions.');
            return;
        }
        
        // Get existing users or create empty array
        const existingUsers = JSON.parse(localStorage.getItem('powerfit_users')) || [];
        
        // Check if email already exists
        const emailExists = existingUsers.some(user => user.email === email);
        if (emailExists) {
            alert('This email is already registered. Please use a different email or login.');
            return;
        }
        
        // Create user object
        const user = {
            fullname,
            email,
            phone,
            dob,
            gender,
            goals,
            membership: selectedMembership,
            membershipPrice,
            newsletter: newsletterChecked,
            password // In a real app, this should be hashed!
        };
        
        // Add new user to array
        existingUsers.push(user);
        
        // Save to localStorage
        localStorage.setItem('powerfit_users', JSON.stringify(existingUsers));
        
        // Show success message
        alert('Registration successful! You can now log in.');
        
        // Redirect to login page
        window.location.href = './log.html';
    });
});