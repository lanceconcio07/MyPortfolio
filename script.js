document.querySelector('.see-more-btn').addEventListener('click', function() {
    const additionalInfo = document.querySelector('.additional-info');
    const button = this;
    
    button.classList.toggle('active');
    additionalInfo.classList.toggle('hidden');
    additionalInfo.classList.toggle('show');
    
    if (button.classList.contains('active')) {
        button.innerHTML = 'See Less <i class="fas fa-chevron-up"></i>';
    } else {
        button.innerHTML = 'See More <i class="fas fa-chevron-down"></i>';
    }
});

// Add this function to handle the location click
function openGoogleMaps() {
    // Encode the address for the URL
    const address = encodeURIComponent("Santo Angel Central Santa Cruz, Laguna");
    // Open Google Maps in a new tab
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
}

// Prevent the directions button from triggering the card click
document.querySelector('.directions-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    openGoogleMaps();
});

// Add this function to handle email click
function sendEmail() {
    const email = 'lanceconcio07@gmail.com';
    const subject = 'Hello Lance'; // Optional: preset subject
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
}

// Add this to load the footer
document.addEventListener('DOMContentLoaded', function() {
    // Fetch the footer content
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            // Insert the footer HTML into the container
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
});

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Add active class to clicked link
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');

            // Smooth scroll with animation
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Animate sections when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Update active nav link while scrolling
    window.addEventListener('scroll', () => {
        let current = '';
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Add visible class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('visible');
    });

    // Handle footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        const footer = document.createElement('footer');
        footer.innerHTML = `
            <p>&copy; 2025 Lance Lordvin Concio. All rights reserved.</p>
        `;
        footerContainer.appendChild(footer);
    }
});

// Add these functions for contact section functionality
function sendEmail() {
    window.location.href = "mailto:lanceconcio07@gmail.com";
}

function openGoogleMaps() {
    window.open("https://www.google.com/maps?q=Santo+Angel+Central+Santa+Cruz+Laguna", "_blank");
}

// FAQ Toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                // Toggle active class on the question
                this.classList.toggle('active');
                
                // Get the answer element
                const answer = this.nextElementSibling;
                const toggleIcon = this.querySelector('.toggle-icon');
                
                // Toggle the answer visibility with animation
                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                    toggleIcon.textContent = '+';
                } else {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    toggleIcon.textContent = '−';
                }
            });
        });
    }
});

// Initialize multiple slideshows
document.addEventListener('DOMContentLoaded', function() {
    // Get all slideshow containers
    const slideshowContainers = document.querySelectorAll('.slideshow-container');
    
    // Initialize each slideshow separately
    slideshowContainers.forEach((container) => {
        let slideIndex = 1;
        const slides = container.getElementsByClassName("slides");
        const dots = container.getElementsByClassName("dot");
        
        // Function to show specific slide
        function showSlide(n) {
            if (n > slides.length) { slideIndex = 1; }
            if (n < 1) { slideIndex = slides.length; }

            // Hide all slides in this container
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
                if (dots[i]) dots[i].className = dots[i].className.replace(" active", "");
            }
            
            // Show current slide
            slides[slideIndex-1].style.display = "block";
            if (dots[slideIndex-1]) dots[slideIndex-1].className += " active";
        }

        // Function to change slides
        function changeSlide(n) {
            showSlide(slideIndex += n);
        }

        // Add click handlers to prev/next buttons for this container
        const prevButton = container.querySelector('.prev');
        const nextButton = container.querySelector('.next');
        
        if (prevButton) {
            prevButton.onclick = function() { changeSlide(-1); };
        }
        if (nextButton) {
            nextButton.onclick = function() { changeSlide(1); };
        }

        // Add click handlers to dots for this container
        for (let i = 0; i < dots.length; i++) {
            dots[i].onclick = function() {
                slideIndex = i + 1;
                showSlide(slideIndex);
            };
        }

        // Show first slide initially
        showSlide(slideIndex);

        // Auto advance slides
        setInterval(function() {
            changeSlide(1);
        }, 4000);
    });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.header')) {
            navLinks.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    navLinks.addEventListener('click', function() {
        navLinks.classList.remove('active');
    });
});
