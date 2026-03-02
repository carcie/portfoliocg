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

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0, 0);

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // Register GSAP Plugin early
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================
       A. NATIVE DOM MAPPING (INTERACTIVE GRID)
       ========================================== */
    const mappings = {
        tech: { fintech: "Algorithmic Triggers", logtech: "Carrier API Integration", vc: "Codebase Auditing" },
        reg: { fintech: "Payment Rails Compliance", logtech: "Cross-border Customs", vc: "Regulatory Moat Analysis" },
        quant: { fintech: "Volatility Hedging", logtech: "Demurrage Prediction", vc: "Financial Modeling" },
        biz: { fintech: "Monetization Strategy", vc: "Product-Market Fit" },
        soft: { fintech: "Cross-Border Communication", logtech: "LATAM Operations Liaison", vc: "Founder Evaluation" }
    };

    const compNodes = document.querySelectorAll('.node-comp');
    const trackNodes = document.querySelectorAll('.node-track');

    compNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const compKey = node.getAttribute('data-comp');
            const related = mappings[compKey];

            // Dim unmatched competencies
            compNodes.forEach(n => {
                if (n !== node) n.classList.add('opacity-20');
            });

            // Highlight and inject text to matched tracks
            trackNodes.forEach(track => {
                const trackKey = track.getAttribute('id').replace('track-', '');
                const labelDiv = track.querySelector('.connection-label');

                if (related[trackKey]) {
                    track.classList.add('border-white', 'bg-gray-900', 'scale-[1.02]');
                    labelDiv.innerHTML = `<span class="text-gray-500 uppercase text-xs tracking-widest block mb-1">Bridged via</span>${related[trackKey]}`;
                    labelDiv.classList.remove('hidden');
                } else {
                    track.classList.add('opacity-20');
                }
            });
        });

        node.addEventListener('mouseleave', () => {
            // Reset all nodes
            compNodes.forEach(n => n.classList.remove('opacity-20'));
            trackNodes.forEach(track => {
                track.classList.remove('opacity-20', 'border-white', 'bg-gray-900', 'scale-[1.02]');
                track.querySelector('.connection-label').classList.add('hidden');
            });
        });
    });

    /* ==========================================
       B. SMART NAVBAR (HIDE ON SCROLL DOWN)
       ========================================== */
    const showAnim = gsap.from('nav', {
        yPercent: -100,
        paused: true,
        duration: 0.3,
        ease: "power2.out"
    }).progress(1);

    ScrollTrigger.create({
        start: "top top",
        end: "max",
        onUpdate: (self) => {
            // Hide on scroll down, show on scroll up
            if (self.direction === 1) {
                showAnim.reverse();
            } else {
                showAnim.play();
            }
        }
    });

    /* ==========================================
       C. GSAP ANIMATIONS & SCROLL TRIGGERS
       ========================================== */
    const tl = gsap.timeline();

    // Reveal Hero Text lines
    tl.to(".gsap-split", {
        y: "0%",
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2
    });

    // Fade in secondary hero elements
    tl.fromTo(".gsap-reveal",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.8"
    );

    tl.fromTo(".gsap-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
        "-=0.8"
    );

    // ScrollTrigger Animations for remaining sections
    const scrollElements = document.querySelectorAll('.gsap-scroll-fade');
    scrollElements.forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            }
        );
    });

    /* ==========================================
       D. BACK TO TOP & PROGRESS RING
       ========================================== */
    const backToTop = document.getElementById('back-to-top');
    const progressRing = document.getElementById('progress-ring');

    if (backToTop && progressRing) {
        // Calculate the circumference of the circle (2 * PI * Radius)
        // Our SVG circle has a radius (r) of 24
        const circumference = 2 * Math.PI * 24;

        // Initialize the SVG stroke properties
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = circumference;

        // Hook into the existing Lenis scroll engine
        lenis.on('scroll', ({ scroll, limit, progress }) => {

            // 1. Math: Map the scroll progress (0 to 1) to the SVG stroke offset
            const offset = circumference - (progress * circumference);
            progressRing.style.strokeDashoffset = offset;

            // 2. Visibility: Show button after scrolling down 300px
            if (scroll > 300) {
                backToTop.classList.replace('opacity-0', 'opacity-100');
                backToTop.classList.remove('pointer-events-none');
            } else {
                backToTop.classList.replace('opacity-100', 'opacity-0');
                backToTop.classList.add('pointer-events-none');
            }
        });

        // Click event to scroll back to the top smoothly
        backToTop.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.2 });
        });
    }
});