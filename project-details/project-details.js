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