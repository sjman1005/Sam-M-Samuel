// Sticky Navigation
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active'); // For potential hamburger animation
});

// Close mobile menu when a link is clicked
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Smooth Scroll for specific anchor behavior (optional, CSS scroll-behavior usually handles it but this is safer for older browsers or specific offset needs)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Calculate offset based on navbar height
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Fade-in Animations on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

// Select elements to animate
// Hero elements are already animated by CSS delays, so we target section elements
document.querySelectorAll('.section-title, .about-content, .skill-category, .timeline-item, .project-card, .edu-card, .contact-wrapper').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Add fade-in to hero elements initially to trigger the CSS transition if they are not using the JS observer
// (The HTML has "fade-in" class but they need "visible" to show up)
window.addEventListener('load', () => {
    document.querySelectorAll('.hero-content .fade-in').forEach(el => {
        el.classList.add('visible');
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');

const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Show sending state (visual feedback only)
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';

        // Check if running on file protocol
        if (window.location.protocol === 'file:') {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

            // Fallback to mailto
            window.location.href = `mailto:ekm.sammsamuel@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Allow button to reset
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
            }, 1000);

            // Optional: show a message saying we opened their mail client
            if (formMessage) {
                formMessage.textContent = "Opening your email client...";
                formMessage.className = "form-message success";
                formMessage.style.display = 'block';
                setTimeout(() => { formMessage.style.display = 'none'; }, 5000);
            }

        } else {
            // We are on a web server (http/https)
            // Programmatically set the action and submit
            // We need to create hidden inputs for config if they don't exist, strictly speaking, 
            // but we can just append them or use the FormData approach if we were capturing.
            // Simplest way: set attributes and call submit()

            contactForm.action = "https://formsubmit.co/ekm.sammsamuel@gmail.com";
            contactForm.method = "POST";

            // Add hidden config fields dynamically if missing
            if (!contactForm.querySelector('input[name="_captcha"]')) {
                const captcha = document.createElement('input');
                captcha.type = 'hidden';
                captcha.name = '_captcha';
                captcha.value = 'false';
                contactForm.appendChild(captcha);
            }
            if (!contactForm.querySelector('input[name="_template"]')) {
                const template = document.createElement('input');
                template.type = 'hidden';
                template.name = '_template';
                template.value = 'table';
                contactForm.appendChild(template);
            }

            // Add redirect to custom page (current page + success query param)
            // This prevents the FormSubmit "Thanks" page from showing
            if (!contactForm.querySelector('input[name="_next"]')) {
                const next = document.createElement('input');
                next.type = 'hidden';
                next.name = '_next';
                // Redirect back to the same page with a query param
                next.value = window.location.origin + window.location.pathname + "?success=true";
                contactForm.appendChild(next);
            }

            // Native submit - triggers page reload/redirect
            contactForm.submit();
        }
    });
}

// Check for success parameter in URL (after redirect)
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        const formMessage = document.getElementById('form-message');
        if (formMessage) {
            formMessage.textContent = "Message has been sent successfully!";
            formMessage.className = "form-message success";
            formMessage.style.display = 'block';

            // Hide after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 6000);

            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});
