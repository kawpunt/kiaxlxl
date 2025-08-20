// BlurText - Vanilla Motion One implementation for word-by-word blur-in animation
// Mirrors the provided React component behavior without requiring React
(function(){
  function buildKeyframes(from, steps){
    const keys = new Set([
      ...Object.keys(from || {}),
      ...steps.flatMap(s => Object.keys(s || {}))
    ]);
    const keyframes = {};
    keys.forEach(k => {
      keyframes[k] = [from[k], ...steps.map(s => s[k])];
    });
    return keyframes;
  }

  function splitIntoWordSpans(el, fullText){
    // Clear and rebuild with spans separated by NBSP
    el.innerHTML = '';
    const words = fullText.split(' ');
    const frag = document.createDocumentFragment();

    const lastThreeStart = Math.max(0, words.length - 3);

    words.forEach((w, idx) => {
      const span = document.createElement('span');
      span.className = 'inline-block will-change-[transform,filter,opacity]';
      span.textContent = w;
      // Apply gradient-text style to last three words to preserve original emphasis
      if (idx >= lastThreeStart) span.classList.add('gradient-text');
      frag.appendChild(span);
      if (idx < words.length - 1) frag.appendChild(document.createTextNode('\u00A0'));
    });
    el.appendChild(frag);
    return Array.from(el.querySelectorAll('span'));
  }

  function applyBlurText(selector, options){
    const {
      text = '',
      delay = 200, // per segment delay in ms
      animateBy = 'words', // only words supported in this vanilla port
      direction = 'top',
      threshold = 0.1,
      rootMargin = '0px',
      animationFrom,
      animationTo,
      easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
      stepDuration = 0.35,
      onAnimationComplete,
    } = options || {};

    const el = document.querySelector(selector);
    if (!el) return;

    const sourceText = text || (el.textContent || '').replace(/\s+/g, ' ').trim();
    const spans = splitIntoWordSpans(el, animateBy === 'words' ? sourceText : sourceText);

    const defaultFrom = direction === 'top'
      ? { filter: 'blur(10px)', opacity: 0, y: -50 }
      : { filter: 'blur(10px)', opacity: 0, y: 50 };

    const defaultTo = [
      { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? 5 : -5 },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ];

    const fromSnapshot = animationFrom || defaultFrom;
    const toSnapshots = animationTo || defaultTo;

    const keyframes = buildKeyframes(fromSnapshot, toSnapshots);

    // Observe when the parent <p>/<h1> is in view
    let observed = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed){
        observed = true;
        observer.unobserve(entry.target);
        // Animate each span with staggered delay
        spans.forEach((span, idx) => {
          // Set initial styles
          span.style.opacity = String(fromSnapshot.opacity ?? 0);
          span.style.filter = fromSnapshot.filter ?? 'blur(10px)';
          span.style.transform = `translateY(${fromSnapshot.y || 0}px)`;

          const duration = stepDuration * (toSnapshots.length);
          const delaySeconds = (idx * delay) / 1000;

          window.motion?.animate(
            span,
            {
              opacity: keyframes.opacity,
              filter: keyframes.filter,
              y: keyframes.y,
            },
            {
              duration,
              delay: delaySeconds,
              easing,
              // Use transform y via Motion One (maps to translateY)
            }
          ).finished.then(() => {
            if (idx === spans.length - 1 && typeof onAnimationComplete === 'function') {
              try{ onAnimationComplete(); } catch(_){}
            }
          });
        });
      }
    }, { threshold, rootMargin });

    observer.observe(el);
  }

  // Expose globally
  window.applyBlurText = applyBlurText;
})();