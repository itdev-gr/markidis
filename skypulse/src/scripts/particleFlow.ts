import { Renderer, Program, Mesh, Triangle } from "ogl";
import vertex from "../assets/shaders/flow.vert?raw";
import fragment from "../assets/shaders/flow.frag?raw";

export interface FlowPreset {
  color1: [number, number, number];
  color2: [number, number, number];
  flowStrength: number;
  density: number;
  speed: number;
  tintAmount: number;
}

// SkyPulse purple-tinted presets.
// color1 = paper white #FFFFFF [1, 1, 1]
// color2 variants of brand purple:
//   #C5B0DA = light lavender    [0.773, 0.690, 0.855]
//   #A98BC7 = mid lavender      [0.663, 0.545, 0.780]
//   #8B6BAF = brand purple      [0.545, 0.420, 0.686]
//   #7C5BAA = mid-deep purple   [0.486, 0.357, 0.667]
//   #5B3E8A = deep purple       [0.357, 0.243, 0.541]
export const PRESETS: Record<string, FlowPreset> = {
  hero:      { color1: [1, 1, 1], color2: [0.663, 0.545, 0.780], flowStrength: 0.22, density: 3.2, speed: 0.9, tintAmount: 0.10 },
  manifesto: { color1: [1, 1, 1], color2: [0.357, 0.243, 0.541], flowStrength: 0.16, density: 2.8, speed: 0.7, tintAmount: 0.08 },
  worlds:    { color1: [1, 1, 1], color2: [0.486, 0.357, 0.667], flowStrength: 0.20, density: 3.6, speed: 0.85, tintAmount: 0.11 },
  cameo:     { color1: [1, 1, 1], color2: [0.545, 0.420, 0.686], flowStrength: 0.18, density: 4.0, speed: 1.0, tintAmount: 0.12 },
  counters:  { color1: [1, 1, 1], color2: [0.357, 0.243, 0.541], flowStrength: 0.20, density: 3.4, speed: 0.9, tintAmount: 0.11 },
  insights:  { color1: [1, 1, 1], color2: [0.773, 0.690, 0.855], flowStrength: 0.14, density: 2.6, speed: 0.65, tintAmount: 0.09 },
  contact:   { color1: [1, 1, 1], color2: [0.486, 0.357, 0.667], flowStrength: 0.16, density: 3.0, speed: 0.8, tintAmount: 0.13 },
};

export function lerpPreset(a: FlowPreset, b: FlowPreset, t: number): FlowPreset {
  const lerp = (x: number, y: number) => x + (y - x) * t;
  const lerp3 = (x: [number, number, number], y: [number, number, number]): [number, number, number] =>
    [lerp(x[0], y[0]), lerp(x[1], y[1]), lerp(x[2], y[2])];
  return {
    color1: lerp3(a.color1, b.color1),
    color2: lerp3(a.color2, b.color2),
    flowStrength: lerp(a.flowStrength, b.flowStrength),
    density: lerp(a.density, b.density),
    speed: lerp(a.speed, b.speed),
    tintAmount: lerp(a.tintAmount, b.tintAmount),
  };
}

export interface ParticleFlow {
  setPreset: (name: keyof typeof PRESETS, durationMs?: number) => void;
  destroy: () => void;
}

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createParticleFlow(container: HTMLElement): ParticleFlow | null {
  if (reduceMotion()) return null;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const renderer = new Renderer({ dpr, alpha: false });
  const gl = renderer.gl;
  gl.clearColor(1, 1, 1, 1);
  container.appendChild(gl.canvas);
  Object.assign(gl.canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    zIndex: "0",
    pointerEvents: "none",
  });

  const geometry = new Triangle(gl);
  const current = { ...PRESETS.hero };

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime:         { value: 0 },
      uResolution:   { value: [gl.canvas.width, gl.canvas.height] },
      uMouse:        { value: [0.5, 0.5] },
      uColor1:       { value: [...current.color1] },
      uColor2:       { value: [...current.color2] },
      uFlowStrength: { value: current.flowStrength },
      uDensity:      { value: current.density },
      uSpeed:        { value: current.speed },
      uTintAmount:   { value: current.tintAmount },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
  };
  onResize();
  window.addEventListener("resize", onResize, { passive: true });

  const onMouse = (e: MouseEvent) => {
    program.uniforms.uMouse.value = [
      e.clientX / window.innerWidth,
      1 - e.clientY / window.innerHeight,
    ];
  };
  window.addEventListener("mousemove", onMouse, { passive: true });

  let rafId = 0;
  let lastFrame = performance.now();
  let slowFrames = 0;
  let transitionStart = 0;
  let transitioning = false;
  let transitionDuration = 0;
  let from: FlowPreset = { ...current };
  let to: FlowPreset = { ...current };

  const tick = (t: number) => {
    const dt = t - lastFrame;
    if (dt > 33) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    lastFrame = t;
    if (slowFrames > 180) {
      destroy();
      return;
    }

    program.uniforms.uTime.value = t * 0.001;

    if (transitioning) {
      const k = Math.min(1, (t - transitionStart) / transitionDuration);
      const eased = 1 - Math.pow(2, -10 * k);
      const lerped = lerpPreset(from, to, eased);
      program.uniforms.uColor1.value = [...lerped.color1];
      program.uniforms.uColor2.value = [...lerped.color2];
      program.uniforms.uFlowStrength.value = lerped.flowStrength;
      program.uniforms.uDensity.value = lerped.density;
      program.uniforms.uSpeed.value = lerped.speed;
      program.uniforms.uTintAmount.value = lerped.tintAmount;
      if (k >= 1) transitioning = false;
    }

    renderer.render({ scene: mesh });
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  function setPreset(name: keyof typeof PRESETS, durationMs = 900) {
    const preset = PRESETS[name];
    if (!preset) return;
    from = {
      color1: [...program.uniforms.uColor1.value] as [number, number, number],
      color2: [...program.uniforms.uColor2.value] as [number, number, number],
      flowStrength: program.uniforms.uFlowStrength.value,
      density: program.uniforms.uDensity.value,
      speed: program.uniforms.uSpeed.value,
      tintAmount: program.uniforms.uTintAmount.value,
    };
    to = preset;
    transitionStart = performance.now();
    transitionDuration = durationMs;
    transitioning = true;
  }

  function destroy() {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMouse);
    gl.canvas.remove();
  }

  return { setPreset, destroy };
}
