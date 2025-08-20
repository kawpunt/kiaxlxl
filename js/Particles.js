import { Renderer, Camera, Geometry, Program, Mesh } from 'https://cdn.skypack.dev/ogl';

const defaultColors = ["#ffffff", "#ffffff", "#ffffff"];

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec4 random;
attribute vec3 color;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;
varying vec4 vRandom;
varying vec3 vColor;
void main() {
  vRandom = random;
  vColor = color;
  vec3 pos = position * uSpread;
  pos.z *= 10.0;
  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  float t = uTime;
  mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
  mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
  mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
  vec4 mvPos = viewMatrix * mPos;
  gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uAlphaParticles;
varying vec4 vRandom;
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));
  if(uAlphaParticles < 0.5) {
    if(d > 0.5) {
      discard;
    }
    gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
  } else {
    float circle = smoothstep(0.5, 0.4, d) * 0.8;
    gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
  }
}
`;

export class Particles {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      particleCount: options.particleCount || 200,
      particleSpread: options.particleSpread || 10,
      speed: options.speed || 0.1,
      particleColors: options.particleColors || defaultColors,
      moveParticlesOnHover: options.moveParticlesOnHover || false,
      particleHoverFactor: options.particleHoverFactor || 1,
      alphaParticles: options.alphaParticles || false,
      particleBaseSize: options.particleBaseSize || 100,
      sizeRandomness: options.sizeRandomness || 1,
      cameraDistance: options.cameraDistance || 20,
      disableRotation: options.disableRotation || false,
      ...options
    };
    this.mouse = { x: 0, y: 0 };
    this.startTime = performance.now();
    this.elapsed = 0;
    this.lastTime = this.startTime;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.renderer = new Renderer({ depth: false, alpha: true });
    this.gl = this.renderer.gl;
    this.container.appendChild(this.gl.canvas);
    this.gl.clearColor(0, 0, 0, 0);
    this.camera = new Camera(this.gl, { fov: 15 });
    this.camera.position.set(0, 0, this.options.cameraDistance);
    this.setupParticles();
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize, false);
    if (this.options.moveParticlesOnHover) {
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.container.addEventListener("mousemove", this.handleMouseMove);
    }
    this.render = this.render.bind(this);
    this.start();
  }

  setupParticles() {
    const count = this.options.particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = this.options.particleColors.length > 0 ? this.options.particleColors : defaultColors;
    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }
    const geometry = new Geometry(this.gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });
    const program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: this.options.particleSpread },
        uBaseSize: { value: this.options.particleBaseSize },
        uSizeRandomness: { value: this.options.sizeRandomness },
        uAlphaParticles: { value: this.options.alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });
    this.particles = new Mesh(this.gl, { mode: this.gl.POINTS, geometry, program });
  }

  handleMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 - 1;
    this.mouse = { x, y };
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.perspective({ aspect: width / height });
  }

  render(t) {
    this.animationFrameId = requestAnimationFrame(this.render);
    const delta = t - this.lastTime;
    this.lastTime = t;
    this.elapsed += delta * this.options.speed;
    this.particles.program.uniforms.uTime.value = this.elapsed * 0.001;
    if (this.options.moveParticlesOnHover) {
      this.particles.position.x = -this.mouse.x * this.options.particleHoverFactor;
      this.particles.position.y = -this.mouse.y * this.options.particleHoverFactor;
    } else {
      this.particles.position.x = 0;
      this.particles.position.y = 0;
    }
    if (!this.options.disableRotation) {
      this.particles.rotation.x = Math.sin(this.elapsed * 0.0002) * 0.1;
      this.particles.rotation.y = Math.cos(this.elapsed * 0.0005) * 0.15;
      this.particles.rotation.z += 0.01 * this.options.speed;
    }
    this.renderer.render({ scene: this.particles, camera: this.camera });
  }

  start() {
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.render);
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  destroy() {
    this.stop();
    window.removeEventListener("resize", this.resize);
    if (this.options.moveParticlesOnHover) {
      this.container.removeEventListener("mousemove", this.handleMouseMove);
    }
    if (this.container.contains(this.gl.canvas)) {
      this.container.removeChild(this.gl.canvas);
    }
  }
}
