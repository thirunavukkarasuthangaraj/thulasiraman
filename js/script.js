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

    // Collect all Tamil text - Complete website content
    const tamilTexts = [
        // Welcome
        "மரிமணிக்குப்பம் பஞ்சாயத்து இணையதளத்திற்கு வரவேற்கிறோம்.",

        // President Info
        "பஞ்சாயத்து தலைவர் துளசி ராமன்.",
        document.getElementById('tamil-text')?.textContent || 'எங்கள் அன்பான மரிமணிக்குப்பம் பஞ்சாயத்தின் வளர்ச்சிக்காக முழு அர்ப்பணிப்புடன் பணியாற்றி வருகிறேன். மக்களின் நலனே எனது முதன்மையான குறிக்கோள். கடந்த காலத்தில் நாம் சேர்ந்து பல சாதனைகளை படைத்துள்ளோம்.',

        // Census Statistics
        "பஞ்சாயத்து விவரங்கள்.",
        "மொத்த மக்கள் தொகை 6919.",
        "ஆண்கள் 3513, அதாவது 50.8 சதவீதம்.",
        "பெண்கள் 3406, அதாவது 49.2 சதவீதம்.",
        "குடும்பங்கள் 1729.",
        "கல்வியறிவு விகிதம் 61.4 சதவீதம்.",
        "குழந்தைகள் 0 முதல் 6 வயது வரை 778 பேர்.",

        // Facilities
        "வசதிகள்.",
        "பள்ளிக் கட்டடங்கள் 6.",
        "குடிநீர் இணைப்புகள் 354.",
        "கைக்குழாய்கள் 24.",
        "சாலைகள் 39.",
        "அரசு கட்டடங்கள் 8.",
        "நீர்த்தேக்கத் தொட்டிகள் 17.",

        // Sub-villages
        "சிற்றூர்கள் 16.",
        "தாடிக்காரன் வட்டம், ஓமகுப்பம் ஆ காலனி, ஆண்டல்வாடிநத்தம், எம் கிருஷ்ணாபுரம், ஓமகுப்பம் காலனி, தோட்டி சுட்டை, மரிமணிக்குப்பம், பூங்காவனம் முதலியார் வட்டம், ஏரிபள்ளம், தொட்டிகுட்டை, மாணிக்க கவுண்டர் வட்டம், நாகனேரி வட்டம், நீலிக்கொல்லை, ஓமகுப்பம், புதூர்.",

        // Works
        "நமது வளர்ச்சி பணிகள்.",
        "சாலை மேம்பாடு. கிராமத்தின் அனைத்து முக்கிய தெருக்களிலும் புதிய தார் சாலைகள் அமைக்கப்பட்டுள்ளன.",
        "குடிநீர் வசதி. அனைத்து வீடுகளுக்கும் சுத்தமான குடிநீர் இணைப்பு வழங்கப்பட்டுள்ளது.",
        "தெரு விளக்குகள். சக்தி சிக்கனமான LED தெரு விளக்குகள் அனைத்து தெருக்களிலும் நிறுவப்பட்டுள்ளன.",
        "கழிவு நீர் வடிகால். முறையான கழிவு நீர் வடிகால் அமைப்பு உருவாக்கப்பட்டுள்ளது.",
        "கோவில் திருப்பணி. கிராம கோவில்களின் புனரமைப்பு பணிகள் வெற்றிகரமாக முடிக்கப்பட்டுள்ளன.",
        "சமூக கூட்டரங்கம். கிராம நிகழ்வுகளுக்கான புதிய சமூக கூட்டரங்கம் கட்டப்பட்டுள்ளது.",

        // Contact
        "தொடர்பு கொள்ள வாட்ஸ்அப் எண் 99444 16906.",

        // Thank you
        "நன்றி. மரிமணிக்குப்பம் பஞ்சாயத்து."
    ];

    const fullText = tamilTexts.filter(t => t.trim()).join(' ');

    // Use Google Translate TTS for better Tamil voice
    isSpeaking = true;
    updateSpeakButton(true);

    // Split text into chunks (Google TTS has character limit)
    const chunks = splitTextIntoChunks(fullText, 200);
    let currentChunk = 0;
    let audioElement = null;

    function playNextChunk() {
        if (currentChunk >= chunks.length || !isSpeaking) {
            isSpeaking = false;
            updateSpeakButton(false);
            return;
        }

        const text = encodeURIComponent(chunks[currentChunk]);
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ta&client=tw-ob&q=${text}`;

        audioElement = new Audio(audioUrl);
        audioElement.playbackRate = 0.9;

        audioElement.onended = () => {
            currentChunk++;
            playNextChunk();
        };

        audioElement.onerror = () => {
            // Fallback to Web Speech API if Google TTS fails
            fallbackToWebSpeech(fullText);
        };

        audioElement.play().catch(() => {
            fallbackToWebSpeech(fullText);
        });
    }

    playNextChunk();
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
