// Safe Carz Limited - Main JavaScript File

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeAnimations();
    initializeNavigation();
    initializeScrollEffects();
    initializeForms();
    initializeCarousels();
    initializeFilters();
    initializeFAQ();
    initializeModals();
});

// Animation Functions
function initializeAnimations() {
    // Fade in animations for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .dashboard-card, .plan-card, .partner-card').forEach(el => {
        observer.observe(el);
    });
}

// Navigation Functions
function initializeNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');

        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Progress bar for scroll
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--accent-orange);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Form Functions
function initializeForms() {
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginForm);
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Validation
    if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        showNotification('Message sent successfully!', 'success');
        e.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleLoginForm(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Password length validation
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Logging in...';
    submitBtn.disabled = true;

    // Simulate login process
    setTimeout(() => {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }, 1500);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearFieldError(e);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Password validation
    if (field.type === 'password' && value && value.length < 6) {
        isValid = false;
        errorMessage = 'Password must be at least 6 characters long';
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');

    let errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('is-invalid');

    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Carousel Functions
function initializeCarousels() {
    // Initialize Swiper for hero carousel
    const heroSwiper = document.querySelector('.hero-swiper');
    if (heroSwiper) {
        new Swiper('.hero-swiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }

    // Initialize Swiper for testimonials
    const testimonialSwiper = document.querySelector('.testimonial-swiper');
    if (testimonialSwiper) {
        new Swiper('.testimonial-swiper', {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            slidesPerView: 1,
            spaceBetween: 30,
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // Initialize Swiper for partner logos
    const partnerSwiper = document.querySelector('.partner-swiper');
    if (partnerSwiper) {
        new Swiper('.partner-swiper', {
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            slidesPerView: 2,
            spaceBetween: 20,
            breakpoints: {
                576: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 4,
                },
                1024: {
                    slidesPerView: 6,
                }
            }
        });
    }

    // Initialize Swiper for reviews
    const reviewSwiper = document.querySelector('.review-swiper');
    if (reviewSwiper) {
        new Swiper('.review-swiper', {
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            slidesPerView: 3,
            spaceBetween: 24,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.review-next',
                prevEl: '.review-prev',
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                },
            },
        });
    }
}

// Filter Functions
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const planCards = document.querySelectorAll('.plan-card');
    const viewMoreBtn = document.getElementById('viewMoreBtn');

    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.dataset.filter;
            filterPlans(filter, planCards);
        });
    });

    // View more functionality
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            const hiddenCards = document.querySelectorAll('.plan-card.d-none');

            hiddenCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('d-none');
                    card.classList.add('fade-in-up');
                }, index * 100);
            });

            viewMoreBtn.style.display = 'none';
        });
    }
}

function filterPlans(filter, cards) {
    cards.forEach(card => {
        const cardCategory = card.dataset.category;
        const cardCompany = card.dataset.company;

        let shouldShow = false;

        if (filter === 'all') {
            shouldShow = true;
        } else if (filter === 'two-wheeler' && cardCategory === 'two-wheeler') {
            shouldShow = true;
        } else if (filter === 'four-wheeler' && cardCategory === 'four-wheeler') {
            shouldShow = true;
        } else if (filter === 'commercial' && cardCategory === 'commercial') {
            shouldShow = true;
        } else if (cardCompany === filter) {
            shouldShow = true;
        }

        if (shouldShow) {
            card.style.display = 'block';
            card.classList.add('fade-in-up');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in-up');
        }
    });
}

// FAQ Functions
function initializeFAQ() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const button = header.querySelector('.accordion-button');
        const collapse = item.querySelector('.accordion-collapse');

        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            // Close all other items
            accordionItems.forEach(otherItem => {
                const otherButton = otherItem.querySelector('.accordion-button');
                const otherCollapse = otherItem.querySelector('.accordion-collapse');

                if (otherItem !== item) {
                    otherButton.setAttribute('aria-expanded', 'false');
                    otherButton.classList.add('collapsed');
                    otherCollapse.classList.remove('show');
                }
            });

            // Toggle current item
            if (isExpanded) {
                button.setAttribute('aria-expanded', 'false');
                button.classList.add('collapsed');
                collapse.classList.remove('show');
            } else {
                button.setAttribute('aria-expanded', 'true');
                button.classList.remove('collapsed');
                collapse.classList.add('show');
            }
        });
    });
}

// Modal Functions
function initializeModals() {
    // Auto-show modal for demo purposes
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');

    if (!hasSeenModal && window.location.pathname.includes('index.html')) {
        setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById('welcomeModal'));
            modal.show();
            localStorage.setItem('hasSeenWelcomeModal', 'true');
        }, 3000);
    }
}

// Dashboard Functions
function initializeDashboard() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');

    if (!isLoggedIn && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'login.html';
        return;
    }

    // Display user info
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement && userEmail) {
        userEmailElement.textContent = userEmail;
    }

    // Initialize dashboard data
    loadDashboardData();
}

function loadDashboardData() {
    // Mock dashboard data
    const policies = [
        {
            id: 'SCZ-2024-001',
            company: 'SecureDrive Insurance',
            type: 'Comprehensive',
            vehicle: 'Toyota Camry 2023',
            premium: 'PKR 35,500/year',
            status: 'active',
            renewal: '2025-03-15',
            coverage: 'PKR 450,000'
        },
        {
            id: 'SCZ-2024-002',
            company: 'AutoGuard Plus',
            type: 'Third Party',
            vehicle: 'Honda Civic 2022',
            premium: 'PKR 20,000/year',
            status: 'active',
            renewal: '2025-06-20',
            coverage: 'PKR 250,000'
        },
        {
            id: 'SCZ-2023-015',
            company: 'RoadSafe Insurance',
            type: 'Comprehensive',
            vehicle: 'Ford F-150 2021',
            premium: 'PKR $56,000/year',
            status: 'expired',
            renewal: '2024-10-30',
            coverage: 'PKR 600,000'
        }
    ];

    const policiesContainer = document.getElementById('policiesContainer');
    if (policiesContainer) {
        policiesContainer.innerHTML = policies.map(policy => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="dashboard-card">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="card-title mb-0">${policy.id}</h5>
                        <span class="status-${policy.status}">${policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}</span>
                    </div>
                    <div class="dashboard-card-body p-0">
                        <p><strong>Company:</strong> ${policy.company}</p>
                        <p><strong>Type:</strong> ${policy.type}</p>
                        <p><strong>Vehicle:</strong> ${policy.vehicle}</p>
                        <p><strong>Premium:</strong> ${policy.premium}</p>
                        <p><strong>Coverage:</strong> ${policy.coverage}</p>
                        <p><strong>Renewal:</strong> ${policy.renewal}</p>
                        <div class="mt-3">
                            <button class="btn btn-primary btn-sm me-2" onclick="viewPolicyDetails('${policy.id}')">View Details</button>
                            <button class="btn btn-outline btn-sm" onclick="renewPolicy('${policy.id}')">Renew</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function viewPolicyDetails(policyId) {
    showNotification(`Viewing details for policy ${policyId}`, 'info');
}

function renewPolicy(policyId) {
    showNotification(`Renewal process started for policy ${policyId}`, 'success');
}

function getQuote() {
    showNotification('Redirecting to quote calculator...', 'info');
    setTimeout(() => {
        window.location.href = 'plans.html';
    }, 1000);
}

function fileClaim() {
    showNotification('Opening claim filing form...', 'info');
    setTimeout(() => {
        window.open('contact.html', '_blank');
    }, 1000);
}

function makePayment() {
    showNotification('Redirecting to payment portal...', 'info');
    setTimeout(() => {
        window.location.href = 'contact.html';
    }, 1000);
}

function contactSupport() {
    showNotification('Opening support chat...', 'info');
    setTimeout(() => {
        window.location.href = 'contact.html';
    }, 1000);
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: var(--shadow-lg);
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Initialize dashboard if on dashboard page
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function () {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .plan-card, .dashboard-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// spinner loader
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  loader.classList.add("loader--hidden");

  loader.addEventListener("transitionend", () => {
    document.body.removeChild(loader);
  });
});
