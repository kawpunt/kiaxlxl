(function(){
  // Simple easing resolver
  function getEaser(easing){
    switch ((easing||'').toLowerCase()){
      case 'linear':
        return t => t;
      case 'ease-in':
        return t => t*t;
      case 'ease-in-out':
        return t => (t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t);
      default:
        // ease-out quad
        return t => t * (2 - t);
    }
  }

  class ClickSparkCanvas{
    constructor(options){
      const defaults = {
        sparkColor: '#fff',
        sparkSize: 10,
        sparkRadius: 15,
        sparkCount: 8,
        duration: 400,
        easing: 'ease-out',
        extraScale: 1.0,
        attachTo: document // element whose viewport is used
      };
      this.opts = Object.assign({}, defaults, options || {});

      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '9999';
      // Helpful class for debugging/overrides
      this.canvas.className = 'click-spark-canvas';

      (this.opts.attachTo.body || document.body).appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      this.sparks = [];
      this._raf = null;
      this._running = false;
      this._easer = getEaser(this.opts.easing);

      // Bindings
      this._onClick = this._onClick.bind(this);
      this._loop = this._loop.bind(this);
      this._resize = this._resize.bind(this);

      // Resize on load and when viewport changes
      this._resize();
      window.addEventListener('resize', this._resize);

      // High-quality rendering on DPR screens
      this._setupDPR();

      // Start listening
      document.addEventListener('click', this._onClick, true);

      // Start loop
      this.start();
    }

    _setupDPR(){
      const dpr = window.devicePixelRatio || 1;
      this._dpr = dpr;
      // Scale the context so we can draw using CSS pixels
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    _resize(){
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Set the internal canvas size to account for DPR
      this.canvas.width = Math.max(1, Math.floor(w * dpr));
      this.canvas.height = Math.max(1, Math.floor(h * dpr));
      // Keep CSS size in CSS pixels
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      // Re-apply transform after resize
      this._setupDPR();
    }

    _onClick(e){
      // Ignore right/middle clicks
      if (e.button && e.button !== 0) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      const { sparkCount } = this.opts;

      for (let i=0;i<sparkCount;i++){
        const angle = (2 * Math.PI * i) / sparkCount;
        this.sparks.push({ x, y, angle, startTime: now });
      }

      if (!this._running) this.start();
    }

    start(){
      if (this._running) return;
      this._running = true;
      this._raf = requestAnimationFrame(this._loop);
    }

    stop(){
      this._running = false;
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null;
    }

    destroy(){
      this.stop();
      window.removeEventListener('resize', this._resize);
      document.removeEventListener('click', this._onClick, true);
      if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
      this.sparks = [];
    }

    _loop(ts){
      const ctx = this.ctx;
      const { width, height } = this.canvas;
      // Clear in device pixels, context already scaled to CSS pixels via transform
      ctx.clearRect(0, 0, width, height);

      const { duration, sparkRadius, sparkSize, extraScale, sparkColor } = this.opts;
      const ease = this._easer;

      const nowSparks = [];
      for (let i=0;i<this.sparks.length;i++){
        const s = this.sparks[i];
        const elapsed = ts - s.startTime;
        if (elapsed >= duration) continue; // skip expired

        const t = elapsed / duration; // 0..1
        const eased = ease(t);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = s.x + distance * Math.cos(s.angle);
        const y1 = s.y + distance * Math.sin(s.angle);
        const x2 = s.x + (distance + lineLength) * Math.cos(s.angle);
        const y2 = s.y + (distance + lineLength) * Math.sin(s.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        nowSparks.push(s);
      }

      this.sparks = nowSparks;

      if (this.sparks.length > 0){
        this._raf = requestAnimationFrame(this._loop);
      } else {
        this._running = false;
        this._raf = null;
      }
    }
  }

  // Public API
  function initClickSpark(options){
    if (window.__clickSparkInstance){
      // Optionally update options
      Object.assign(window.__clickSparkInstance.opts, options || {});
      window.__clickSparkInstance._easer = getEaser(window.__clickSparkInstance.opts.easing);
      return window.__clickSparkInstance;
    }
    const inst = new ClickSparkCanvas(options);
    window.__clickSparkInstance = inst;
    return inst;
  }

  // Expose globally
  window.initClickSpark = initClickSpark;

  // Auto-init with theme color if desired. Comment this out if you want manual control.
  function auto(){
    try{ initClickSpark({ sparkColor: '#FFD700' }); }catch(_){/* no-op */}
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', auto);
  } else {
    auto();
  }
})();
