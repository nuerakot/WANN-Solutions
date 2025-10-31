// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load testimonials from XML
    loadTestimonials();
    
    // Dark/Light mode toggle
    setupDarkModeToggle();
    
    // Form validation for contact page
    if (document.querySelector('#contact-form')) {
        setupFormValidation();
    }
});

// Function to load testimonials from XML
function loadTestimonials() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;

    fetch('data.xml')
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const testimonials = data.querySelectorAll('testimonial');
            let testimonialHTML = '';
            
           testimonials.forEach(testimonial => {
    const name = testimonial.querySelector('name').textContent;
    const role = testimonial.querySelector('role').textContent;
    const company = testimonial.querySelector('company').textContent;
    const content = testimonial.querySelector('content').textContent;
    const image = testimonial.querySelector('image') ? testimonial.querySelector('image').textContent : 'default.jpg';

    testimonialHTML += `
        <div class="testimonial-item">
            <blockquote>
                <p>"${content}"</p>
                <img src="${image}" alt="${name}" class="testimonial-img">
                <footer>
                    <strong>${name}</strong>, ${role} at <em>${company}</em>
                </footer>
            </blockquote>
        </div>
    `
});
            
            
            testimonialSlider.innerHTML = testimonialHTML;
        })
        .catch(error => {
            console.error('Error loading testimonials:', error);
            testimonialSlider.innerHTML = '<p>Testimonials loading failed. Please check back later.</p>';
        });
}



// Dark/Light Mode Toggle
function setupDarkModeToggle() {
    const modeToggle = document.createElement('button');
    modeToggle.id = 'mode-toggle';
    modeToggle.textContent = '🌙 Dark Mode';
    modeToggle.style.position = 'fixed';
    modeToggle.style.bottom = '20px';
    modeToggle.style.right = '20px';
    modeToggle.style.zIndex = '1000';
    modeToggle.style.padding = '10px 15px';
    modeToggle.style.borderRadius = '5px';
    modeToggle.style.border = 'none';
    modeToggle.style.backgroundColor = 'var(--primary-color)';
    modeToggle.style.color = 'white';
    modeToggle.style.cursor = 'pointer';
    
    document.body.appendChild(modeToggle);
    
    modeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        modeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
        
        // Save preference to localStorage
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Check for saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        modeToggle.textContent = '☀️ Light Mode';
    }
}

// Form Validation for Contact Page
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(event) {
        let isValid = true;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Clear previous error messages
        document.querySelectorAll('.error').forEach(el => el.remove());
        
        // Validate name
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            isValid = false;
        }
        
        // Validate email
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Message is required');
            isValid = false;
        }
        
        if (!isValid) {
            event.preventDefault();
        }
    });
}

function showError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    errorElement.style.color = 'red';
    errorElement.style.marginTop = '5px';
    errorElement.style.fontSize = '0.8rem';
    errorElement.textContent = message;
    
    input.insertAdjacentElement('afterend', errorElement);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}