// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.querySelector('.button-text');
    const buttonLoading = document.querySelector('.button-loading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Enhanced email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show loading state
    function showLoading() {
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'flex';
    }

    // Hide loading state
    function hideLoading() {
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
    }

    // Hide all messages
    function hideMessages() {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    }

    // Show success message
    function showSuccess() {
        hideMessages();
        successMessage.style.display = 'flex';
        emailInput.value = '';
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }

    // Show error message
    function showError(message) {
        hideMessages();
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
        
        // Auto-hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Handle form submission
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Basic validation
        if (!email) {
            showError('Please enter your email address');
            emailInput.focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            emailInput.focus();
            return;
        }
        
        // Show loading state
        showLoading();
        
        try {
            // Create form data for Formspree
            const formData = new FormData();
            formData.append('email', email);
            formData.append('_subject', 'New signup from khpal.ai');
            formData.append('_replyto', email);
            
            // Submit to Formspree with proper configuration
            const response = await fetch('https://formspree.io/f/mzzvlwgw', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showSuccess();
                console.log('Email submitted successfully:', email);
                
                // Optional: Track signup event (you can add analytics here)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'signup', {
                        event_category: 'engagement',
                        event_label: 'waitlist'
                    });
                }
            } else {
                // Handle specific Formspree errors
                if (data.errors) {
                    const errorMessages = data.errors.map(error => error.message).join(', ');
                    showError(`Error: ${errorMessages}`);
                } else {
                    showError('Unable to subscribe. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error submitting email:', error);
            showError('Connection error. Please check your internet and try again.');
        } finally {
            hideLoading();
        }
    });

    // Hide messages when user starts typing
    emailInput.addEventListener('input', function() {
        hideMessages();
    });

    // Create animated background particles
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (2 + Math.random() * 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Logo text animation enhancement
    const logoText = document.getElementById('logoText');
    if (logoText) {
        logoText.addEventListener('mouseenter', function() {
            logoText.style.animationDuration = '2s';
        });
        
        logoText.addEventListener('mouseleave', function() {
            logoText.style.animationDuration = '4s';
        });
    }

    // Staggered page load animations
    const animatedElements = document.querySelectorAll('.coming-soon-badge, .main-title, .subtitle, .email-signup');
    animatedElements.forEach(function(element, index) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(function() {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
});

// Performance optimizations
window.addEventListener('load', () => {
    // Lazy load any images if added later
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});
