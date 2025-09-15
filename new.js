document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Payment Method Selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove selected class from all methods
            paymentMethods.forEach(m => m.classList.remove('selected'));
            
            // Add selected class to clicked method
            this.classList.add('selected');
            
            // If PayPal is selected, hide card info section
            const cardInfoSection = document.querySelector('h3:nth-of-type(2)').nextElementSibling;
            const cardElements = document.querySelectorAll('.form-group:not(.checkbox-group)');
            
            if (this.querySelector('.payment-method-title').textContent === 'PayPal') {
                cardElements.forEach(el => el.style.display = 'none');
                document.querySelector('h3:nth-of-type(2)').style.display = 'none';
            } else {
                cardElements.forEach(el => el.style.display = 'block');
                document.querySelector('h3:nth-of-type(2)').style.display = 'block';
            }
        });
    });

    // Format Card Number Input (add spaces every 4 digits)
    const cardNumberInput = document.getElementById('card-number');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            // Add space after every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            
            // Limit to 19 characters (16 digits + 3 spaces)
            if (value.length > 19) {
                value = value.slice(0, 19);
            }
            
            this.value = value;
        });
    }
    
    // Format Expiration Date Input (MM/YY format)
    const expiryDateInput = document.getElementById('expiry-date');
    
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            
            // Limit to 5 characters (MM/YY)
            if (value.length > 5) {
                value = value.slice(0, 5);
            }
            
            this.value = value;
            
            // Auto-validate month input
            if (value.length >= 2) {
                const month = parseInt(value.slice(0, 2));
                if (month < 1 || month > 12) {
                    this.style.borderColor = '#ff4d4d';
                } else {
                    this.style.borderColor = '';
                }
            }
        });
    }
    
    // Format CVV Input (limit to 3-4 digits)
    const cvvInput = document.getElementById('cvv');
    
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 4 digits (some cards have 4-digit CVVs)
            if (value.length > 4) {
                value = value.slice(0, 4);
            }
            
            this.value = value;
        });
    }
    
    // Format Zip Code Input
    const zipInput = document.getElementById('billing-zip');
    
    if (zipInput) {
        zipInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 5 digits for US zip codes
            if (value.length > 5) {
                value = value.slice(0, 5);
            }
            
            this.value = value;
        });
    }

    // Payment Form Validation
    const paymentForm = document.querySelector('.payment-form');
    const submitButton = paymentForm.querySelector('.btn-primary');
    
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Reset previous error states
            clearErrors();
            
            // Check if PayPal is selected - if so, redirect to PayPal
            const selectedMethod = document.querySelector('.payment-method.selected');
            const isPayPal = selectedMethod.querySelector('.payment-method-title').textContent === 'PayPal';
            
            if (isPayPal) {
                // Simulate PayPal redirect
                simulatePayPalRedirect();
                return;
            }
            
            // Validate card details
            const cardName = document.getElementById('card-name').value.trim();
            const cardNumber = document.getElementById('card-number').value.trim().replace(/\s/g, '');
            const expiryDate = document.getElementById('expiry-date').value.trim();
            const cvv = document.getElementById('cvv').value.trim();
            const zipCode = document.getElementById('billing-zip').value.trim();
            
            let isValid = true;
            
            // Validate cardholder name
            if (cardName === '') {
                showError('card-name', 'Please enter the cardholder name');
                isValid = false;
            }
            
            // Validate card number
            if (cardNumber === '') {
                showError('card-number', 'Please enter your card number');
                isValid = false;
            } else if (cardNumber.length < 13 || cardNumber.length > 16) {
                showError('card-number', 'Please enter a valid card number');
                isValid = false;
            } else if (!isValidCardNumber(cardNumber)) {
                showError('card-number', 'Invalid card number');
                isValid = false;
            }
            
            // Validate expiry date
            if (expiryDate === '') {
                showError('expiry-date', 'Please enter the expiry date');
                isValid = false;
            } else if (!isValidExpiryDate(expiryDate)) {
                showError('expiry-date', 'Card has expired or invalid date');
                isValid = false;
            }
            
            // Validate CVV
            if (cvv === '') {
                showError('cvv', 'Please enter the CVV');
                isValid = false;
            } else if (cvv.length < 3) {
                showError('cvv', 'Invalid CVV');
                isValid = false;
            }
            
            // Validate zip code
            if (zipCode === '') {
                showError('billing-zip', 'Please enter your billing zip code');
                isValid = false;
            } else if (zipCode.length < 5) {
                showError('billing-zip', 'Please enter a valid zip code');
                isValid = false;
            }
            
            // If form is valid, process payment
            if (isValid) {
                processPayment();
            }
        });
    }
    
    // Helper functions
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorMessage = document.createElement('div');
        
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        errorMessage.style.color = '#ff4d4d';
        errorMessage.style.fontSize = '0.8rem';
        errorMessage.style.marginTop = '5px';
        
        field.style.borderColor = '#ff4d4d';
        
        // Insert error message after the field
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
    
    function clearErrors() {
        // Remove all error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.remove());
        
        // Reset border color of all inputs
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }
    
    function isValidCardNumber(cardNumber) {
        // Luhn algorithm for card number validation
        let sum = 0;
        let doubleUp = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (doubleUp) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            doubleUp = !doubleUp;
        }
        
        return sum % 10 === 0;
    }
    
    function isValidExpiryDate(expiryDate) {
        // Check format
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            return false;
        }
        
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed
        const currentYear = currentDate.getFullYear() % 100;
        
        const expiryMonth = parseInt(month, 10);
        const expiryYear = parseInt(year, 10);
        
        // Check if month is valid
        if (expiryMonth < 1 || expiryMonth > 12) {
            return false;
        }
        
        // Check if card has expired
        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
            return false;
        }
        
        return true;
    }
    
    function processPayment() {
        // Show loading state
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        
        // Simulate payment processing
        setTimeout(() => {
            showPaymentSuccess();
        }, 2000);
    }
    
    function simulatePayPalRedirect() {
        // Show loading state
        submitButton.textContent = 'Redirecting to PayPal...';
        submitButton.disabled = true;
        
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        
        const spinner = document.createElement('div');
        spinner.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #ff4d4d;"></i>';
        
        overlay.appendChild(spinner);
        document.body.appendChild(overlay);
        
        // Simulate redirect delay
        setTimeout(() => {
            // In a real app, this would redirect to PayPal
            showPaymentSuccess();
            document.body.removeChild(overlay);
        }, 2000);
    }
    
    function showPaymentSuccess() {
        // Create success message container
        const successContainer = document.createElement('div');
        successContainer.className = 'payment-success';
        successContainer.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        successContainer.style.padding = '40px 20px';
        successContainer.style.borderRadius = '10px';
        successContainer.style.textAlign = 'center';
        successContainer.style.marginTop = '30px';
        
        // Create success icon
        const successIcon = document.createElement('div');
        successIcon.innerHTML = '<i class="fas fa-check-circle" style="font-size: 4rem; color: #4caf50; margin-bottom: 20px;"></i>';
        
        // Create success message
        const successHeading = document.createElement('h2');
        successHeading.textContent = 'Payment Successful!';
        successHeading.style.color = '#fff';
        successHeading.style.marginBottom = '15px';
        
        const successMessage = document.createElement('p');
        successMessage.textContent = 'Thank you for joining PowerFit! Your membership is now active.';
        successMessage.style.fontSize = '1.1rem';
        successMessage.style.marginBottom = '30px';
        
        // Create dashboard button
        const dashboardBtn = document.createElement('a');
        dashboardBtn.href = 'dashboard.html';
        dashboardBtn.className = 'btn-primary';
        dashboardBtn.textContent = 'GO TO MEMBER DASHBOARD';
        dashboardBtn.style.marginBottom = '20px';
        dashboardBtn.style.display = 'inline-block';
        
        // Assemble success message
        successContainer.appendChild(successIcon);
        successContainer.appendChild(successHeading);
        successContainer.appendChild(successMessage);
        successContainer.appendChild(dashboardBtn);
        
        // Replace form content with success message
        const form = document.querySelector('.payment-form');
        form.innerHTML = '';
        form.appendChild(successContainer);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
});