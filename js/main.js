// Main JavaScript for khpal.ai landing page
class KhpalLanding {
    constructor() {
        this.email = '';
        this.isSubmitted = false;
        this.mousePosition = { x: 0, y: 0 };
        
        // DOM elements
        this.cursorGlow = document.getElementById('cursorGlow');
        this.emailForm = document.getElementById('emailForm');
        this.emailInput = document.getElementById('emailInput');
        this.submitButton = document.querySelector('.submit-button');
        this.buttonText = document.querySelector('.button-text');
        this.buttonLoading = document.querySelector('.button-loading');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        this.duplicateMessage = document.getElementById('duplicateMessage');
        this.errorText = document.getElementById('errorText');
        this.particlesContainer = document.querySelector('.particles-container');
        
        this.init();
    }
    
    init() {
        this.createParticles();
        this.setupEventListeners();
        this.setupCursorEffect();
        this.setupAnimations();
    }
    
    // Create animated background particles
    createParticles() {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random animation delays and durations
            const delay = Math.random() * 3;
            const duration = 2 + Math.random() * 3;
            
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            this.particlesContainer.appendChild(particle);
        }
    }
    
    // Setup cursor glow effect
    setupCursorEffect() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            
            if (this.cursorGlow) {
                this.cursorGlow.style.left = `${e.clientX - 192}px`;
                this.cursorGlow.style.top = `${e.clientY - 192}px`;
            }
        });
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Email form submission - let Formspree handle it
        if (this.emailForm) {
            this.emailForm.addEventListener('submit', (e) => {
                // Show loading state
                this.showLoading();
                
                // Let the form submit naturally to Formspree
                setTimeout(() => {
                    this.showSuccess();
                    this.hideLoading();
                }, 1000);
            });
        }
        
        // Email input events
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => this.hideMessages());
        }
        
        // Logo text animation
        const logoText = document.getElementById('logoText');
        if (logoText) {
            logoText.addEventListener('mouseenter', () => {
                logoText.style.animationDuration = '2s';
            });
            
            logoText.addEventListener('mouseleave', () => {
                logoText.style.animationDuration = '4s';
            });
        }
    }
    
    // Setup page animations
    setupAnimations() {
        // Add entrance animations
        const elements = document.querySelectorAll('.coming-soon-badge, .main-title, .subtitle, .email-signup');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }
    
    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show loading state
    showLoading() {
        if (this.submitButton) {
            this.submitButton.disabled = true;
        }
        if (this.buttonText) {
            this.buttonText.style.display = 'none';
        }
        if (this.buttonLoading) {
            this.buttonLoading.style.display = 'flex';
        }
    }
    
    // Hide loading state
    hideLoading() {
        if (this.submitButton) {
            this.submitButton.disabled = false;
        }
        if (this.buttonText) {
            this.buttonText.style.display = 'inline';
        }
        if (this.buttonLoading) {
            this.buttonLoading.style.display = 'none';
        }
    }
    
    // Hide all messages
    hideMessages() {
        if (this.successMessage) this.successMessage.style.display = 'none';
        if (this.errorMessage) this.errorMessage.style.display = 'none';
        if (this.duplicateMessage) this.duplicateMessage.style.display = 'none';
    }
    
    // Show success message
    showSuccess() {
        this.hideMessages();
        if (this.successMessage) {
            this.successMessage.style.display = 'flex';
        }
        if (this.emailInput) {
            this.emailInput.value = '';
            this.emailInput.blur();
        }
        this.isSubmitted = true;
    }
    
    // Show error message
    showError(message) {
        this.hideMessages();
        if (this.errorText) {
            this.errorText.textContent = message;
        }
        if (this.errorMessage) {
            this.errorMessage.style.display = 'flex';
        }
        if (this.emailInput) {
            this.emailInput.focus();
        }
    }
    
    // Show duplicate message
    showDuplicate() {
        this.hideMessages();
        if (this.duplicateMessage) {
            this.duplicateMessage.style.display = 'flex';
        }
        if (this.emailInput) {
            this.emailInput.value = '';
            this.emailInput.blur();
        }
    }
    
    // Submit to Formspree
    async submitToBackend(email) {
        try {
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
                return { success: true, message: 'Email submitted successfully' };
            } else {
                throw new Error('Failed to submit email');
            }
        } catch (error) {
            console.error('Formspree submission error:', error);
            throw new Error('Network error. Please try again.');
        }
    }
    
    // Handle form submission
    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput ? this.emailInput.value.trim() : '';
        
        // Validate email
        if (!email) {
            this.showError('please enter your email address');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('please enter a valid email address');
            return;
        }
        
        // Show loading state
        this.showLoading();
        
        try {
            // Submit to backend
            const result = await this.submitToBackend(email);
            
            this.showSuccess();
            
            // Track analytics
            this.trackAnalytics('waitlist_signup', email);
            
            console.log(`Successfully added ${email} to waitlist. Total subscribers: ${result.totalSubscribers || 1}`);
            
        } catch (error) {
            console.error('Submission error:', error);
            
            if (error.message === 'duplicate') {
                this.showDuplicate();
            } else {
                this.showError(error.message || 'something went wrong. please try again.');
            }
        } finally {
            this.hideLoading();
        }
    }
    
    // Track analytics
    trackAnalytics(event, email) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', event, {
                'event_category': 'waitlist',
                'event_label': email
            });
        }
        
        // Mixpanel
        if (typeof mixpanel !== 'undefined') {
            mixpanel.track(event, {
                email: email,
                timestamp: new Date().toISOString()
            });
        }
        
        // Console log for development
        console.log(`Analytics: ${event} - ${email}`);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KhpalLanding();
    
    // Add some additional interactive effects
    const addInteractiveEffects = () => {
        // Parallax effect for particles
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const particles = document.querySelectorAll('.particle');
            
            particles.forEach((particle, index) => {
                const speed = 0.5 + (index * 0.1);
                particle.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
        
        // Add hover effects to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
        });
        
        // Add focus effects to inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
            });
        });
    };
    
    addInteractiveEffects();
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
