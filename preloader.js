document.addEventListener("DOMContentLoaded", () => {
    const preloaderWrapper = document.getElementById('preloader-wrapper');
    const canvas = document.getElementById('paper-preloader');
    const percentEl = document.getElementById('preloader-percentage');
    if (!canvas || !preloaderWrapper) return;

    // Set up Paper.js
    paper.setup(canvas);

    // Generate background bubbles outside the bottle
    for (let i = 0; i < 25; i++) {
        const bgBubble = document.createElement('div');
        bgBubble.className = 'bg-bubble';
        const size = Math.random() * 40 + 15;
        bgBubble.style.width = size + 'px';
        bgBubble.style.height = size + 'px';
        bgBubble.style.left = Math.random() * 100 + 'vw';
        bgBubble.style.animationDuration = (Math.random() * 6 + 4) + 's';
        bgBubble.style.animationDelay = (Math.random() * 5) + 's';
        preloaderWrapper.appendChild(bgBubble);
    }

    // Initialize wave ripple effect on the background
    if (typeof $ !== 'undefined' && $.fn.ripples) {
        $('#preloader-wrapper').ripples({
            resolution: 256,
            dropRadius: 30,
            perturbance: 0.04,
            interactive: false
        });
        
        // Periodically drop background ripples
        setInterval(() => {
            if (preloaderWrapper.style.display !== 'none') {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                $('#preloader-wrapper').ripples('drop', x, y, Math.random() * 10 + 15, 0.03);
            }
        }, 1500);
    }

    // Create a path for the background fluid wave
    const backPath = new paper.Path({
        fillColor: '#5ab5be', // New requested color for the back wave
        closed: true
    });

    // Create a path for the front fluid wave
    const frontPath = new paper.Path({
        fillColor: '#0f8fad', // New requested color for the front wave
        closed: true
    });

    const numPoints = 6;
    
    // Create initial points (wave + 2 bottom corners) for both paths
    for (let i = 0; i <= numPoints; i++) {
        backPath.add(new paper.Point(0, 0));
        frontPath.add(new paper.Point(0, 0));
    }
    backPath.add(new paper.Point(0, 0)); // Bottom Right
    backPath.add(new paper.Point(0, 0)); // Bottom Left
    
    frontPath.add(new paper.Point(0, 0)); // Bottom Right
    frontPath.add(new paper.Point(0, 0)); // Bottom Left

    // Create Bubbles inside the liquid
    const numBubbles = 25;
    const bubbles = [];
    for (let i = 0; i < numBubbles; i++) {
        const radius = Math.random() * 2 + 1.5;
        const bubble = new paper.Path.Circle(new paper.Point(0, 0), radius);
        bubble.fillColor = 'rgba(255, 255, 255, 0.6)';
        bubble.data = {
            xStart: Math.random() * 150, // initial random X position
            yOffset: Math.random() * 400, // random height distribution
            speed: Math.random() * 1.5 + 0.8,
            wobbleOffset: Math.random() * Math.PI * 2,
            wobbleAmp: Math.random() * 8 + 3
        };
        bubbles.push(bubble);
    }

    let targetProgress = 0;
    let currentProgress = 0;
    const waveAmpFront = 15; // Realistic amplitude for the front wave
    const waveAmpBack = 22; // Realistic amplitude for the back wave
    
    // Simulated loading percentage
    let percent = 0;
    const loadingInterval = setInterval(() => {
        // Slow down as it gets higher for realism
        let increment = Math.random() * 8 + 2;
        if (percent > 70) increment = Math.random() * 3 + 1;
        
        percent += increment;
        if (percent >= 100) {
            percent = 100;
            clearInterval(loadingInterval);
            
            // Hide preloader smoothly when complete
            setTimeout(() => {
                preloaderWrapper.style.opacity = '0';
                preloaderWrapper.style.transition = 'opacity 0.8s ease-out';
                setTimeout(() => {
                    preloaderWrapper.style.display = 'none';
                    if (paper.view) paper.view.onFrame = null;
                    if (typeof $ !== 'undefined' && $.fn.ripples) {
                        try { $('#preloader-wrapper').ripples('destroy'); } catch(e) {}
                    }
                }, 800);
            }, 600);
        }
        
        percentEl.innerText = Math.floor(percent);
        targetProgress = percent / 100;
    }, 100);

    // Animation Loop
    paper.view.onFrame = function(event) {
        // Smoothly ease the current progress towards the target percentage
        currentProgress += (targetProgress - currentProgress) * 0.08;
        
        const viewW = paper.view.size.width;
        const viewH = paper.view.size.height;
        
        // Water level (0 is bottom, viewH. viewH * 0 is top)
        const waterLevelY = viewH - (currentProgress * viewH);
        
        // The wave should calm down as it reaches the very top and very bottom
        const calmFactor = Math.sin(Math.PI * currentProgress); 
        
        // Update wave points (overhang left and right sides by 100px for clean edges)
        for (let i = 0; i <= numPoints; i++) {
            const x = -100 + (i / numPoints) * (viewW + 200);
            
            // Calculate back wave (offset phase, different speed)
            const backWave = Math.sin(event.time * 2.5 + (i / numPoints) * Math.PI * 1.5 + Math.PI);
            const backY = waterLevelY + backWave * waveAmpBack * calmFactor - 15; // slightly higher
            backPath.segments[i].point.set(x, backY);

            // Calculate front wave
            const frontWave = Math.sin(event.time * 2 + (i / numPoints) * Math.PI * 1.5);
            const frontY = waterLevelY + frontWave * waveAmpFront * calmFactor;
            frontPath.segments[i].point.set(x, frontY);
        }
        
        // Fix bottom corner points well outside the visible area
        backPath.segments[numPoints + 1].point.set(viewW + 100, viewH + 100);
        backPath.segments[numPoints + 2].point.set(-100, viewH + 100);
        
        frontPath.segments[numPoints + 1].point.set(viewW + 100, viewH + 100);
        frontPath.segments[numPoints + 2].point.set(-100, viewH + 100);

        // Smooth the path for a liquid vector feel
        backPath.smooth({ type: 'continuous' });
        frontPath.smooth({ type: 'continuous' });
        
        // Ensure the bottom corners remain sharp and don't curve
        backPath.segments[numPoints + 1].clearHandles();
        backPath.segments[numPoints + 2].clearHandles();
        
        frontPath.segments[numPoints + 1].clearHandles();
        frontPath.segments[numPoints + 2].clearHandles();

        // Animate Bubbles
        for (let i = 0; i < bubbles.length; i++) {
            const bubble = bubbles[i];
            
            // Move up
            bubble.data.yOffset += bubble.data.speed;
            
            // Calculate wobbly path
            const x = bubble.data.xStart + Math.sin(event.time * 2.5 + bubble.data.wobbleOffset) * bubble.data.wobbleAmp;
            const y = viewH - bubble.data.yOffset;
            
            bubble.position.x = x;
            bubble.position.y = y;
            
            // If bubble breaches the water surface, reset it to the bottom
            if (y < waterLevelY - 5) {
                bubble.data.yOffset = -10; // start slightly below the canvas
                bubble.data.xStart = Math.random() * viewW;
            }
        }
    };
});
