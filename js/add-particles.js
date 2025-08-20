// Simple script to add Particles to the hero section
import { Particles } from './Particles.js';

document.addEventListener('DOMContentLoaded', function() {
  console.log('Adding Particles to hero section...');
  
  const heroSection = document.querySelector('.hero') || document.querySelector('#home');
  
  if (!heroSection) {
    console.warn('Hero section not found');
    return;
  }
  
  if (getComputedStyle(heroSection).position === 'static') {
    heroSection.style.position = 'relative';
  }
  
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-container';
  particlesContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  `;
  
  heroSection.insertBefore(particlesContainer, heroSection.firstChild);
  
  const particles = new Particles(particlesContainer, {
    particleCount: 500,
    particleSpread: 20,
    speed: 0.1,
    moveParticlesOnHover: false,
    particleHoverFactor: 1,
    alphaParticles: false,
    particleBaseSize: 200,
    sizeRandomness: 1,
    cameraDistance: 30,
    disableRotation: false,
    particleColors: ["#00ff00", "#0000ff", "#ff00ff", "#00ffff"]
  });
  
  console.log('Particles background added successfully!');
  
  window.heroParticles = particles;
});
