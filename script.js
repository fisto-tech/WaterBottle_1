// Force scroll to top on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Removed liquid.js import

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// Mobile Menu Toggle Logic
// ==========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');
const navbar = document.querySelector('nav');

if (mobileMenuBtn && mobileMenu) {
    function toggleMobileMenu() {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            // small delay to allow display:block to apply before opacity transition
            setTimeout(() => mobileMenu.classList.remove('opacity-0'), 10);
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Remove pill styling to blend with full-screen menu
            navbar.classList.remove('bg-white/95', 'shadow-lg', 'border', 'backdrop-blur-md', 'border-gray-100');
        } else {
            mobileMenu.classList.add('opacity-0');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            }, 300); // match duration-300
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Restore pill styling
            navbar.classList.add('bg-white/95', 'shadow-lg', 'border', 'backdrop-blur-md', 'border-gray-100');
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when a link inside mobile menu is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) toggleMobileMenu();
        });
    });

    // Close menu when a link inside navbar (like logo or order now button) is clicked
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) toggleMobileMenu();
        });
    });
}

// ==========================================
// Lenis Smooth Scroll Initialization
// ==========================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Synchronize Lenis scrolling with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ==========================================
// Go to Top Button Logic
// ==========================================
const goToTopBtn = document.getElementById('go-to-top');
if (goToTopBtn) {
    // Show/hide based on scroll position
    lenis.on('scroll', (e) => {
        if (e.scroll > 300) {
            goToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
        } else {
            goToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
        }
    });

    // Scroll to top on click
    goToTopBtn.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 1.5 });
    });
}

// Handle smooth scrolling for anchor links using Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Skip if it's just '#'
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            // offset -80 ensures the section isn't hidden behind the fixed navbar
            lenis.scrollTo(target, { offset: -80 });
        }
    });
});

// Create a main timeline tied to ScrollTrigger to ensure all animations reverse together
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "main",
        start: "top 90%",
        toggleActions: "play none none none", // Do not reverse when scrolling down
    }
});

// 1. Navbar items (Slide down from top)
tl.from('nav > a, nav > div > a, nav > div > button', {
    y: -20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.05,
    ease: "power2.out"
})
// 2. Left Panel Headings (Slide in from left)
.from('main h2', {
    x: -40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "power3.out"
}, "-=0.3") // start 0.3s before previous animation ends
// 3. Left Panel Paragraph (Slide up)
.from('main p', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out"
}, "-=0.4")
// 4. Features Text (Subtle scale up)
.from('.text-\\[8px\\]', {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    stagger: 0.05,
    ease: "back.out(1.5)"
}, "-=0.3")
// 5. Right Card Texts (Slide in from right)
.from('main h3, main li', {
    x: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.05,
    ease: "power2.out"
}, "-=0.4");

// ==========================================
// Image Slider Logic
// ==========================================
const bottleImg = document.getElementById('hero-bottle');
const currentSlideEl = document.getElementById('current-slide');
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');
const title1 = document.getElementById('hero-title-1');
const title2 = document.getElementById('hero-title-2');
const desc = document.getElementById('hero-desc');

const slidesData = [
    {
        bottles: [
            './assets/Bottle/Restaurant/bottle_1.webp',
            './assets/Bottle/Restaurant/bottle_2.webp',
            './assets/Bottle/Restaurant/bottle_3.webp'
        ],
        bgUrl: './assets/Hero_bg/Hero_bg_1.webp',
        title1: 'CRAFTED FOR <br> GREAT FOOD.',
        title2: 'PURE BY NATURE..',
        desc: 'FIST-O Brings You Premium Packaged Drinking Water With 7-Stage Purification, Minerals Balance And 100% Trust.'
    },
    {
        bottles: [
            './assets/Bottle/Airlines/bottle_4.webp',
            './assets/Bottle/Airlines/bottle_5.webp',
            './assets/Bottle/Airlines/bottle_6.webp'
        ],
        bgUrl: './assets/Hero_bg/Hero_bg_2.webp',
        title1: 'REFRESH YOUR <br> EVERYDAY.',
        title2: 'CRISP & CLEAR..',
        desc: 'Stay hydrated with our premium quality water, perfectly balanced for your active lifestyle.'
    },
    {
        bottles: [
            './assets/Bottle/Bus/bottle_7.webp',
            './assets/Bottle/Bus/bottle_8.webp',
            './assets/Bottle/Bus/bottle_9.webp'
        ],
        bgUrl: './assets/Hero_bg/Hero_bg_3.webp',
        title1: 'VITALITY IN <br> EVERY DROP.',
        title2: 'MINERAL RICH..',
        desc: 'Enhanced with essential minerals to give you the perfect boost of energy and wellness.'
    },
    {
        bottles: [
            './assets/Bottle/Retail/bottle_10.webp',
            './assets/Bottle/Retail/bottle_11.webp',
            './assets/Bottle/Retail/bottle_12.webp'
        ],
        bgUrl: './assets/Hero_bg/Hero_bg_4.webp',
        title1: 'ESSENCE OF <br> PURITY.',
        title2: 'SIMPLY BEST..',
        desc: 'Experience the pristine taste of naturally filtered water, untouched and pure as nature intended.'
    }
];

let currentIndex = 0;
let currentBottleIndex = 0;
let slideTimeout;
let isAnimating = false; // Prevent spam clicking

// Initialize jQuery Ripples Background on the main element (underneath)
const heroSection = $('main');
heroSection.css({
    'background-image': `url(${slidesData[0].bgUrl})`,
    'background-size': 'cover',
    'background-position': 'center'
});

// Initialize Global Ripple Overlay (on top layer of Hero)
let globalRipple = $('#global-ripple-overlay');
let collTopRipple = $('#collection-top-ripple');
let galTopRipple = $('#gallery-top-ripple');
let banTopRipple = $('#banner-top-ripple');
let conTopRipple = $('#contact-top-ripple');

$(window).on('load', function() {
    globalRipple.ripples({
        resolution: 256,
        perturbance: 0.01,
        interactive: false 
    });

    // Initialize Top-Layer Ripple Overlays for other sections
    collTopRipple.ripples({ resolution: 256, perturbance: 0.01, interactive: false });
    galTopRipple.ripples({ resolution: 256, perturbance: 0.01, interactive: false });
    banTopRipple.ripples({ resolution: 256, perturbance: 0.01, interactive: false });
    conTopRipple.ripples({ resolution: 256, perturbance: 0.01, interactive: false });

    // Initialize interactive ripples on main background elements of each section
    $('main').ripples({ resolution: 256, perturbance: 0.04, interactive: true });
    $('#collection').ripples({ resolution: 256, perturbance: 0.04, interactive: true });
    $('#gallery-ripple').ripples({ resolution: 256, perturbance: 0.04, interactive: true });
    $('#banner-ripple').ripples({ resolution: 256, perturbance: 0.04, interactive: true });
});

// Trigger ripples globally on mouse movement for all top overlays
$(document).on('mousemove', function(e) {
    // 1. Hero Section
    if (e.pageY <= heroSection.outerHeight()) {
        globalRipple.ripples('drop', e.pageX, e.pageY, 20, 0.04);
    }

    // 2. Collection Section
    let collOffset = $('#collection').offset();
    if (e.pageX >= collOffset.left && e.pageX <= collOffset.left + $('#collection').outerWidth() &&
        e.pageY >= collOffset.top && e.pageY <= collOffset.top + $('#collection').outerHeight()) {
        collTopRipple.ripples('drop', e.pageX - collOffset.left, e.pageY - collOffset.top, 20, 0.04);
    }

    // 3. Gallery Section
    let galOffset = $('#gallery').offset();
    if (e.pageX >= galOffset.left && e.pageX <= galOffset.left + $('#gallery').outerWidth() &&
        e.pageY >= galOffset.top && e.pageY <= galOffset.top + $('#gallery').outerHeight()) {
        let x = e.pageX - galOffset.left;
        let y = e.pageY - galOffset.top;
        x = $('#gallery').outerWidth() - x; // Invert X due to transform scaleX(-1)
        galTopRipple.ripples('drop', x, y, 20, 0.04);
    }

    // 4. Banner Section
    let banEl = $('#banner-ripple');
    let banOffset = banEl.offset();
    if (e.pageX >= banOffset.left && e.pageX <= banOffset.left + banEl.outerWidth() &&
        e.pageY >= banOffset.top && e.pageY <= banOffset.top + banEl.outerHeight()) {
        banTopRipple.ripples('drop', e.pageX - banOffset.left, e.pageY - banOffset.top, 20, 0.04);
    }

    // 5. Contact Section
    let conEl = $('#contact');
    let conOffset = conEl.offset();
    if (e.pageX >= conOffset.left && e.pageX <= conOffset.left + conEl.outerWidth() &&
        e.pageY >= conOffset.top && e.pageY <= conOffset.top + conEl.outerHeight()) {
        conTopRipple.ripples('drop', e.pageX - conOffset.left, e.pageY - conOffset.top, 20, 0.04);
    }
});

// Removed section-specific ripples as it's now global on body

function scheduleNextStep() {
    clearTimeout(slideTimeout);
    slideTimeout = setTimeout(nextStep, 2000);
}

function nextStep() {
    if (isAnimating) {
        scheduleNextStep();
        return;
    }
    
    currentBottleIndex++;
    
    if (currentBottleIndex >= slidesData[currentIndex].bottles.length) {
        // Change category
        nextSlide();
    } else {
        // Change bottle
        changeBottle(slidesData[currentIndex].bottles[currentBottleIndex]);
    }
}

function changeBottle(newSrc) {
    // Create a clone of the current bottle for crossfading
    const clone = bottleImg.cloneNode(true);
    clone.removeAttribute('id'); // Avoid duplicate IDs
    clone.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'z-10');
    
    // Append clone to overlay the original
    bottleImg.parentNode.appendChild(clone);
    
    // Update the original image to the new source and hide it initially
    bottleImg.src = newSrc;
    gsap.set(bottleImg, { opacity: 0 });
    
    // Fade in the new image
    gsap.to(bottleImg, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut"
    });
    
    // Fade out the old image (clone)
    gsap.to(clone, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
            clone.remove(); // Clean up clone
            scheduleNextStep();
        }
    });
}

function updateSlider(index) {
    if (isAnimating) return;
    isAnimating = true;
    
    clearTimeout(slideTimeout);
    
    const nextSlide = slidesData[index];
    currentIndex = index;
    currentBottleIndex = 0;

    // Crossfade the main hero section background seamlessly
    const heroOverlay = $('<div class="absolute inset-0 w-full h-full bg-cover bg-center z-[0]" style="opacity:0;"></div>');
    heroOverlay.css('background-image', `url(${nextSlide.bgUrl})`);
    heroSection.prepend(heroOverlay);
    
    heroOverlay.animate({opacity: 1}, 600, function() {
        heroSection.css('background-image', `url(${nextSlide.bgUrl})`);
        try { heroSection.ripples('set', 'imageUrl', nextSlide.bgUrl); } catch(e) {}
        
        // Wait a tiny bit for the WebGL texture to load before removing the static overlay
        setTimeout(() => {
            heroOverlay.remove();
        }, 250);
    });

    // Smoothly transition the global ripple overlay
    globalRipple.animate({opacity: 0}, 300, function() {
        try { globalRipple.ripples('set', 'imageUrl', nextSlide.bgUrl); } catch(e) {}
        
        setTimeout(() => {
            globalRipple.animate({opacity: 0.3}, 400);
        }, 150);
    });

    // Fade out text with a slight slide
    gsap.to([title1, title2, desc], {
        opacity: 0, 
        x: -20,
        duration: 0.3, 
        ease: "power1.in"
    });

    // Fade out bottle dynamically
    gsap.to(bottleImg, {
        opacity: 0, 
        scale: 0.5,
        y: 50,
        duration: 0.4, 
        ease: "power2.in",
        onComplete: () => {
            // Swap text and bottle content
            bottleImg.src = nextSlide.bottles[0];
            title1.innerHTML = nextSlide.title1;
            title2.innerHTML = nextSlide.title2;
            desc.innerHTML = nextSlide.desc;
            
            currentSlideEl.innerText = `0${index + 1}`;
            
            // Setup text and bottle for entrance
            gsap.set([title1, title2, desc], { x: 20 });
            gsap.set(bottleImg, { scale: 1.2, y: -50, rotation: 0 });
            
            // Stagger text in
            gsap.to([title1, title2, desc], {
                opacity: 1, 
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            });

            // Bounce bottle in
            gsap.to(bottleImg, {
                opacity: 1, 
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.75)",
                onComplete: () => {
                    isAnimating = false;
                    scheduleNextStep();
                }
            });
        }
    });
}

function nextSlide() {
    if (isAnimating) return;
    let nextIndex = (currentIndex + 1) % slidesData.length;
    updateSlider(nextIndex);
}

function prevSlide() {
    if (isAnimating) return;
    let prevIndex = (currentIndex - 1 + slidesData.length) % slidesData.length;
    updateSlider(prevIndex);
}

// Event Listeners for manual navigation
if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        clearTimeout(slideTimeout);
        nextSlide();
    });
    prevBtn.addEventListener('click', () => {
        clearTimeout(slideTimeout);
        prevSlide();
    });
}

// Start auto slider on load
scheduleNextStep();


// ==========================================
// Gallery Infinite Scroll Animation
// ==========================================
// Column 1 moves UP continuously
gsap.to('.gallery-col-1', {
    yPercent: -50, // Moves up by exactly 50% (one full set of the duplicated images)
    ease: 'none',
    duration: 35,  // Slow, smooth continuous movement
    repeat: -1     // Infinite loop
});

// Column 2 moves DOWN continuously
// First, offset it to start at -50% so it can move down to 0
gsap.set('.gallery-col-2', { yPercent: -50 });
gsap.to('.gallery-col-2', {
    yPercent: 0,
    ease: 'none',
    duration: 40,  // Slightly different speed for variation
    repeat: -1
});

// ==========================================
// Unique Text Animations for Each Section (with reverse)
// ==========================================

// 1. Collection Section: Slide in from the left
const collectionText = document.querySelectorAll('#collection h2, #collection p, #collection a, #collection button');
if (collectionText.length > 0) {
    gsap.from(collectionText, {
        scrollTrigger: {
            trigger: '#collection',
            start: "top 80%",
            toggleActions: "play reverse play reverse",
        },
        x: -80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        clearProps: "all"
    });
}

// 2. Banner Section: Dramatic scale and elastic bounce
const bannerText = document.querySelectorAll('#banner h2, #banner p, #banner button');
if (bannerText.length > 0) {
    gsap.from(bannerText, {
        scrollTrigger: {
            trigger: '#banner',
            start: "top 75%",
            toggleActions: "play reverse play reverse",
        },
        scale: 0.5,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "elastic.out(1, 0.7)",
        clearProps: "all"
    });
}

// 3. Contact Us Section: Bouncy slide up
const contactText = document.querySelectorAll('#contact h2, #contact span, #contact p, #contact form');
if (contactText.length > 0) {
    gsap.from(contactText, {
        scrollTrigger: {
            trigger: '#contact',
            start: "top 80%",
            toggleActions: "play reverse play reverse",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: "back.out(1.5)",
        clearProps: "all"
    });
}

// 4. Footer Section: Smooth slow fade up
const footerText = document.querySelectorAll('footer h2, footer p, footer span');
if (footerText.length > 0) {
    gsap.from(footerText, {
        scrollTrigger: {
            trigger: 'footer',
            start: "top 95%",
            toggleActions: "play reverse play reverse",
        },
        y: 30,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all"
    });
}

// ==========================================
// Interactive Cards Hover Logic (Reference JS)
// ==========================================
const icCards = document.querySelectorAll("#interactive-cards .card");

if (icCards.length > 0) {
    icCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            icCards.forEach((c) => {
                if (c === card) c.classList.add("active");
                else c.classList.add("not-active");
            });
        });

        card.addEventListener("mouseleave", () => {
            icCards.forEach((c) => {
                c.classList.remove("active", "not-active");
            });
        });
    });

    gsap.from("#interactive-cards h2, #interactive-cards p, #interactive-cards .card", {
        scrollTrigger: {
            trigger: '#interactive-cards',
            start: "top 85%",
            toggleActions: "play reverse play reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.4,
        stagger: 0.02,
        ease: "power3.out",
        clearProps: "transform,opacity" // <--- CRITICAL FIX: clear inline styles so CSS hover transform works
    });
}

// ==========================================
// Collection Video Speed
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const collectionVideo = document.getElementById("collection-video");
    if (collectionVideo) {
        collectionVideo.playbackRate = 0.5;
    }
});
