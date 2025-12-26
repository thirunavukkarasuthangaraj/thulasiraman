/**
 * மரிமணிக்குப்பம் - Village President Showcase
 * JavaScript for Slider and Interactions
 */

// Slider Variables
let currentSlide = 0;
let slides;
let dots;
let slideInterval;
const SLIDE_DURATION = 5000; // 5 seconds auto-slide

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    initScrollAnimations();
});

/**
 * Initialize the Image Slider
 */
function initSlider() {
    slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!slides.length || !dotsContainer) return;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    dots = document.querySelectorAll('.dot');

    // Start auto-slide
    startAutoSlide();

    // Pause on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const slider = document.querySelector('.slider');
    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                changeSlide(1); // Swipe left - next
            } else {
                changeSlide(-1); // Swipe right - prev
            }
        }
    }
}

/**
 * Change slide by direction
 * @param {number} direction - 1 for next, -1 for previous
 */
function changeSlide(direction) {
    goToSlide(currentSlide + direction);
}

/**
 * Go to specific slide
 * @param {number} index - Slide index
 */
function goToSlide(index) {
    if (!slides || !slides.length) return;

    // Remove active class from current
    slides[currentSlide].classList.remove('active');
    if (dots && dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
    }

    // Calculate new index with wrap-around
    currentSlide = (index + slides.length) % slides.length;

    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    if (dots && dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

/**
 * Start automatic slideshow
 */
function startAutoSlide() {
    stopAutoSlide(); // Clear any existing interval
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, SLIDE_DURATION);
}

/**
 * Stop automatic slideshow
 */
function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe work cards
    document.querySelectorAll('.work-card').forEach(card => {
        observer.observe(card);
    });

    // Observe video cards
    document.querySelectorAll('.video-card').forEach(card => {
        observer.observe(card);
    });
}

/**
 * Smooth scroll to section
 * @param {string} sectionId - ID of section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});
