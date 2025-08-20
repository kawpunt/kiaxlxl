// Script to add DarkVeil effects to service cards
document.addEventListener('DOMContentLoaded', function() {
    console.log('Adding DarkVeil to service cards...');
    
    // Find all service cards
    const serviceCards = document.querySelectorAll('.service-card-modern');
    
    if (serviceCards.length === 0) {
        console.warn('No service cards found');
        return;
    }
    
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl || !window.DarkVeil) {
        console.warn('WebGL not supported or DarkVeil not loaded');
        return;
    }
    
    // Add DarkVeil to each service card with consistent colors
    serviceCards.forEach((card, index) => {
        // Make sure card is positioned
        if (getComputedStyle(card).position === 'static') {
            card.style.position = 'relative';
        }
        
        // Create DarkVeil container
        const darkVeilContainer = document.createElement('div');
        darkVeilContainer.className = 'darkveil-container';
        darkVeilContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
            border-radius: 24px;
        `;
        
        // Insert at the beginning of card (behind content)
        card.insertBefore(darkVeilContainer, card.firstChild);
        
        // Create DarkVeil with consistent settings for all cards
        const darkVeil = new DarkVeil(darkVeilContainer, {
            hueShift: 45,             // Uniform gold hue for all cards
            noiseIntensity: 0.03,     // Subtle noise
            scanlineIntensity: 0.08,  // Light scanlines
            speed: 0.3,               // Slow animation
            scanlineFrequency: 0.005,  // Sparse scanlines
            warpAmount: 0.3,          // Gentle warping
            resolutionScale: 0.5       // Performance optimization
        });
        
        // Store reference globally for debugging
        window['serviceCardBackground' + index] = darkVeil;
        
        console.log(`DarkVeil added to service card ${index}`);
    });
    
    console.log('DarkVeil backgrounds added to all service cards!');
});
