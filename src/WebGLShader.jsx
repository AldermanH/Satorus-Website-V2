/* WebGL shader background — chromatic-aberration ribbon waves.
   Ported from a 21st.dev TSX/Tailwind/Next component to plain JSX/CSS.
   Sizes to its parent element (not the window) so it stays contained.
   Honours prefers-reduced-motion: renders one static frame, no rAF loop. */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = /* glsl */ `
  attribute vec3 position;
  void main() { gl_Position = vec4(position, 1.0); }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform vec2  resolution;
  uniform float time;
  uniform float xScale;
  uniform float yScale;
  uniform float distortion;

  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float d = length(p) * distortion;

    float rx = p.x * (1.0 + d);
    float gx = p.x;
    float bx = p.x * (1.0 - d);

    float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
    float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
    float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

    /* Alpha = max channel — bright band lines are opaque, dark areas
       transparent. Lets us drop CSS mix-blend-mode: screen, which some
       Android Chrome builds render as opaque-black, hiding the shader. */
    float a = max(r, max(g, b));
    gl_FragColor = vec4(r, g, b, a);
  }
`;

export default function WebGLShader({
  className = "",
  xScale = 1.0,
  yScale = 0.5,
  distortion = 0.05,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0x000000), 0);

    const uniforms = {
      resolution: { value: [parent.clientWidth, parent.clientHeight] },
      time:       { value: 0.0 },
      xScale:     { value: xScale },
      yScale:     { value: yScale },
      distortion: { value: distortion },
    };

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([
          -1, -1, 0,   1, -1, 0,  -1, 1, 0,
           1, -1, 0,  -1,  1, 0,   1, 1, 0,
        ]),
        3,
      ),
    );

    const material = new THREE.RawShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      uniforms.resolution.value = [w, h];
    };

    resize();
    renderer.render(scene, camera);

    // rAF loop — pause/resume via IntersectionObserver so we're not burning
    // GPU rendering chromatic-aberration waves behind a hero the visitor has
    // already scrolled past.
    let rafId = null;
    const tick = () => {
      uniforms.time.value += 0.01;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    const startLoop = () => {
      if (rafId == null && !reduced) rafId = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // Kick the loop off immediately so the shader animates from first paint.
    // Mobile Safari can be late firing the IntersectionObserver's first
    // callback, which left the canvas rendered but static. The observer
    // below still pauses/resumes on scroll, this is just a defensive start.
    startLoop();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) startLoop();
          else stopLoop();
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [xScale, yScale, distortion]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true"/>;
}
