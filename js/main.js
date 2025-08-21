// Simple JavaScript for khpal.ai landing page
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.querySelector('.button-text');
    const buttonLoading = document.querySelector('.button-loading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Simple email validation
    function isValidEmail(email) {
        return email.includes('@') && email.includes('.');
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
    }

    // Show error message
    function showError(message) {
        hideMessages();
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
    }

    // Handle button click
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', async function(e) {
        
        const email = emailInput.value.trim();
        
        // Basic validation
        if (!email) {
            showError('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Show loading
        showLoading();
        
        try {
            // Submit to Formspree
            const formData = new FormData();
            formData.append('email', email);
            
            const response = await fetch('https://formspree.io/f/mzzvlwgw', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showSuccess();
                console.log('Email submitted successfully:', email);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            console.error('Error submitting email:', error);
            showError('Something went wrong. Please try again.');
        } finally {
            hideLoading();
        }
    });

    // Hide messages when user starts typing
    emailInput.addEventListener('input', hideMessages);
    
    // Handle Enter key press
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitButton.click();
        }
    });

    // Cursor glow effect
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        document.addEventListener('mousemove', function(e) {
            cursorGlow.style.left = (e.clientX - 192) + 'px';
            cursorGlow.style.top = (e.clientY - 192) + 'px';
        });
    }

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

    // Logo text animation
    const logoText = document.getElementById('logoText');
    if (logoText) {
        logoText.addEventListener('mouseenter', function() {
            logoText.style.animationDuration = '2s';
        });
        
        logoText.addEventListener('mouseleave', function() {
            logoText.style.animationDuration = '4s';
        });
    }

    // Page animations
    const elements = document.querySelectorAll('.coming-soon-badge, .main-title, .subtitle, .email-signup');
    elements.forEach(function(element, index) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(function() {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
});

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add performance optimizations
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
