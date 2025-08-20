// Simple script to add DarkVeil to the hero section
document.addEventListener('DOMContentLoaded', function() {
    console.log('Adding DarkVeil to hero section...');
    
    // Find the hero section
    const heroSection = document.querySelector('.hero') || document.querySelector('#home');
    
    if (!heroSection) {
        console.warn('Hero section not found');
        return;
    }
    
    // Make sure hero section is positioned
    if (getComputedStyle(heroSection).position === 'static') {
        heroSection.style.position = 'relative';
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
        z-index: 1;
        overflow: hidden;
    `;
    
    // Insert at the beginning of hero section (behind content)
    heroSection.insertBefore(darkVeilContainer, heroSection.firstChild);
    
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl && window.DarkVeil) {
        console.log('Creating DarkVeil background...');
        
        // Create DarkVeil with dramatic settings
        const darkVeil = new DarkVeil(darkVeilContainer, {
            hueShift: 45,           // Golden hue
            noiseIntensity: 0.08,   // Visible noise for texture
            scanlineIntensity: 0.15, // Retro scanlines
            speed: 0.6,             // Moderate animation speed
            scanlineFrequency: 0.01, // Scanline density
            warpAmount: 0.8,        // Dynamic warping
            resolutionScale: 0.8    // Performance optimization
        });
        
        console.log('DarkVeil background added successfully!');
        
        // Store reference globally for debugging
        window.heroBackground = darkVeil;
        
    } else {
        console.warn('WebGL not supported or DarkVeil not loaded, using fallback...');
        
        // Fallback: simple animated gradient
        darkVeilContainer.style.background = `
            linear-gradient(45deg, 
                rgba(255, 215, 0, 0.1), 
                transparent, 
                rgba(255, 165, 0, 0.05)
            )
        `;
        darkVeilContainer.style.animation = 'pulse 4s ease-in-out infinite';
        
        // Add CSS animation if not exists
        if (!document.getElementById('fallback-animation')) {
            const style = document.createElement('style');
            style.id = 'fallback-animation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(1.02); }
                }
            `;
            document.head.appendChild(style);
        }
    }
});