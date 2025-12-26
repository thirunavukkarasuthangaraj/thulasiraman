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

/**
 * Tamil Text-to-Speech Function
 * Speaks all Tamil text on the website
 */
let isSpeaking = false;
let speechUtterance = null;

function speakTamil() {
    // If already speaking, stop
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        updateSpeakButton(false);
        return;
    }

    // Simple Tamil Introduction - No numbers
    const tamilText = `மரிமணிக்குப்பம் பஞ்சாயத்து இணையதளத்திற்கு வரவேற்கிறோம்.
        நான் துளசி ராமன், இந்த பஞ்சாயத்தின் தலைவர்.
        எங்கள் அன்பான மரிமணிக்குப்பம் பஞ்சாயத்தின் வளர்ச்சிக்காக முழு அர்ப்பணிப்புடன் பணியாற்றி வருகிறேன்.
        மக்களின் நலனே எனது முதன்மையான குறிக்கோள்.
        கடந்த காலத்தில் நாம் சேர்ந்து பல சாதனைகளை படைத்துள்ளோம்.
        சாலை மேம்பாடு, குடிநீர் வசதி, தெரு விளக்குகள், கழிவு நீர் வடிகால் போன்ற பல வளர்ச்சி பணிகள் செய்யப்பட்டுள்ளன.
        எங்கள் பஞ்சாயத்தை பார்வையிட்டதற்கு நன்றி.`;

    // Use Web Speech API with Tamil voice
    isSpeaking = true;
    updateSpeakButton(true);

    const utterance = new SpeechSynthesisUtterance(tamilText);
    utterance.lang = 'ta-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1;

    // Get Tamil voice
    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang === 'ta-IN') ||
                       voices.find(v => v.lang.startsWith('ta')) ||
                       voices.find(v => v.name.toLowerCase().includes('tamil'));

    if (tamilVoice) {
        utterance.voice = tamilVoice;
    }

    utterance.onend = () => {
        isSpeaking = false;
        updateSpeakButton(false);
    };

    utterance.onerror = () => {
        isSpeaking = false;
        updateSpeakButton(false);
    };

    window.speechSynthesis.speak(utterance);
}

// Split text into smaller chunks
function splitTextIntoChunks(text, maxLength) {
    const chunks = [];
    const sentences = text.split(/[.।,]/);
    let currentChunk = '';

    sentences.forEach(sentence => {
        if ((currentChunk + sentence).length < maxLength) {
            currentChunk += sentence + '. ';
        } else {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = sentence + '. ';
        }
    });
    if (currentChunk) chunks.push(currentChunk.trim());

    return chunks;
}

// Fallback to Web Speech API
function fallbackToWebSpeech(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ta-IN';
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang.includes('ta'));
    if (tamilVoice) utterance.voice = tamilVoice;

    utterance.onend = () => {
        isSpeaking = false;
        updateSpeakButton(false);
    };

    window.speechSynthesis.speak(utterance);
}

function updateSpeakButton(speaking) {
    const btn = document.querySelector('.speak-btn');
    if (btn) {
        btn.classList.toggle('speaking', speaking);
        const text = btn.querySelector('span');
        if (text) {
            text.textContent = speaking ? 'நிறுத்து' : 'கேளுங்கள்';
        }
    }
}

// Load voices when available
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}
