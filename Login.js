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

    // Check if user is already logged in
    const currentUser = localStorage.getItem('powerfit_current_user');
    if (currentUser) {
        // Redirect to home page or dashboard if already logged in
        // window.location.href = './Home.html';
    }

    // Handle login form submission
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember')?.checked || false;
            
            // Form validation
            if (!email || !password) {
                showMessage('Please enter both email and password', 'error');
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('powerfit_users')) || [];
            
            // Find user with matching email
            const user = users.find(user => user.email === email);
            
            // Validate user credentials
            if (!user) {
                showMessage('Email not found. Please sign up first.', 'error');
                return;
            }
            
            if (user.password !== password) {
                showMessage('Incorrect password. Please try again.', 'error');
                return;
            }
            
            // Login successful
            // Create a user session object (excluding password for security)
            const userSession = {
                fullname: user.fullname,
                email: user.email,
                membership: user.membership,
                loggedInAt: new Date().toString()
            };
            
            // Store user session in localStorage
            localStorage.setItem('powerfit_current_user', JSON.stringify(userSession));
            
            // Show success message
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to home/dashboard page after short delay
            setTimeout(() => {
                window.location.href = './Home.html';
            }, 1500);
        });
    }
    
    // Handle social login buttons (placeholder functionality)
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Social login feature coming soon!');
        });
    });
    
    // Handle forgot password link (placeholder functionality)
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Password reset feature coming soon!');
        });
    }
    
    // Function to display messages
    function showMessage(message, type = 'info') {
        // Check if message container exists, if not create one
        let messageContainer = document.querySelector('.message-container');
        
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.className = 'message-container';
            document.querySelector('.login-container').prepend(messageContainer);
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // Add message to container
        messageContainer.innerHTML = ''; // Clear previous messages
        messageContainer.appendChild(messageElement);
        
        // Auto remove message after delay
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
});