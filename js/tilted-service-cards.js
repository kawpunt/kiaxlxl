// Script to add tilt effects to all service cards
document.addEventListener('DOMContentLoaded', function() {
    // Check if device is touch-enabled
    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    }

    // Apply tilt effect to cards
    function applyTiltEffect(card) {
        if (!card || card.dataset.tiltInitialized === '1') return;
        card.dataset.tiltInitialized = '1';

        // Set amplitude for tilt effect
        var amplitude = 14;
        var scaleOnHover = 1.05;

        // Prepare styles for 3D effect
        card.style.transformStyle = 'preserve-3d';
        card.style.willChange = 'transform';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.transition = 'transform 300ms cubic-bezier(0.22,1,0.36,1)';

        var rect = null;
        var rafId = null;
        var hovering = false;

        function updateTransform(clientX, clientY) {
            if (!rect) rect = card.getBoundingClientRect();
            var offsetX = clientX - rect.left - rect.width / 2;
            var offsetY = clientY - rect.top - rect.height / 2;
            var nx = offsetX / (rect.width / 2);
            var ny = offsetY / (rect.height / 2);
            var rotX = -ny * amplitude;
            var rotY = nx * amplitude;
            
            card.style.transition = 'transform 40ms linear';
            card.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(' + scaleOnHover + ')';
        }

        function onEnter() {
            hovering = true;
        }

        function onMove(e) {
            if (!hovering) return;
            var cx = e.clientX, cy = e.clientY;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(function() { 
                updateTransform(cx, cy); 
            });
        }

        function onLeave() {
            hovering = false;
            card.style.transition = 'transform 400ms cubic-bezier(0.22,1,0.36,1)';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        }

        // Add event listeners for tilt effect
        if (amplitude > 0 && !isTouchDevice()) {
            card.addEventListener('mouseenter', onEnter);
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);
        }
    }

    // Initialize tilt effect for all service cards
    function initServiceCardTilt() {
        var serviceCards = document.querySelectorAll('.service-card-modern');
        serviceCards.forEach(function(card) {
            applyTiltEffect(card);
        });
    }

    // Run initialization
    initServiceCardTilt();
});
