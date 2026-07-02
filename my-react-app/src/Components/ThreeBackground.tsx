import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * "Aurora silk" backdrop: a single full-screen quad whose fragment shader
 * layers domain-warped fbm noise into slow, ribbon-like color drifts in the
 * site palette. The mouse adds a very gentle local warp. Deliberately low
 * contrast and slow so it reads as atmosphere, not motion.
 */

const VERT = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;      // 0..1, smoothed
  uniform float uScroll;    // 0..1 page scroll, smoothed

  // Palette (light theme)
  const vec3 BG     = vec3(0.961, 0.965, 0.976); // #f5f6f9
  const vec3 INDIGO = vec3(0.431, 0.459, 0.910); // #6e75e8
  const vec3 ROSE   = vec3(0.941, 0.529, 0.604); // #f0879a
  const vec3 TEAL   = vec3(0.588, 0.820, 0.878); // #96d1e0

  // 2D value-noise fbm — cheap and smooth, plenty for silk.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.05;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv;
    p.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.03; // very slow

    // Scroll slides the field upward slightly so the backdrop feels alive
    // while scrolling without drawing the eye.
    p.y += uScroll * 0.6;

    // Gentle warp toward the mouse — a soft lens, not a spotlight.
    vec2 m = uMouse;
    m.x *= uResolution.x / uResolution.y;
    float md = distance(p, m);
    p += normalize(m - p + 1e-4) * 0.08 * smoothstep(0.9, 0.0, md);

    // Domain warping: q and r bend the space the ribbons live in.
    vec2 q = vec2(
      fbm(p * 1.1 + vec2(0.0, t)),
      fbm(p * 1.1 + vec2(5.2, 1.3) - t)
    );
    vec2 r = vec2(
      fbm(p * 1.2 + 2.0 * q + vec2(1.7, 9.2) + t * 0.7),
      fbm(p * 1.2 + 2.0 * q + vec2(8.3, 2.8) - t * 0.5)
    );
    float f = fbm(p * 1.15 + 2.2 * r);

    // Map the warped field into three overlapping tint bands.
    float bandA = smoothstep(0.25, 0.75, f);                    // indigo
    float bandB = smoothstep(0.35, 0.9, length(q));             // rose
    float bandC = smoothstep(0.4, 0.95, r.y);                   // teal

    vec3 col = BG;
    col = mix(col, INDIGO, bandA * 0.14);
    col = mix(col, ROSE,   bandB * 0.09);
    col = mix(col, TEAL,   bandC * 0.10);

    // Thin brighter filaments along the field's ridges — the "silk threads".
    float ridge = 1.0 - abs(f * 2.0 - 1.0);
    float thread = smoothstep(0.86, 0.995, ridge);
    col = mix(col, INDIGO, thread * 0.10);

    // Keep the center column (where text lives) closest to the page bg.
    float centerGuard = smoothstep(0.62, 0.18, abs(uv.x - 0.5));
    col = mix(col, BG, centerGuard * 0.45);

    // Soften edges into the page background.
    float vign = smoothstep(1.25, 0.35, distance(uv, vec2(0.5, 0.5)));
    col = mix(BG, col, clamp(vign + 0.35, 0.0, 1.0));

    gl_FragColor = vec4(col, 1.0);
  }
`;

type Props = {
  className?: string;
};

const ThreeBackground: React.FC<Props> = ({ className }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' });
    } catch {
      return; // no WebGL — the plain page background is a fine fallback
    }

    // A fragment-shader backdrop doesn't need full DPR to look smooth.
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(
          mount.clientWidth * pixelRatio,
          mount.clientHeight * pixelRatio
        ),
      },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // Targets, lerped per-frame so all motion stays soft.
    const mouseTarget = new THREE.Vector2(0.5, 0.5);
    let scrollTarget = 0;

    const onPointerMove = (e: PointerEvent) => {
      mouseTarget.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollTarget = window.scrollY / max;
    };
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w * pixelRatio, h * pixelRatio);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();

    let running = true;
    const onVisibility = () => { running = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', onVisibility);

    const clock = new THREE.Clock();
    let raf = 0;

    const renderFrame = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(mouseTarget, 0.03);
      uniforms.uScroll.value += (scrollTarget - uniforms.uScroll.value) * 0.04;
      renderer.render(scene, camera);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (running) renderFrame();
    };

    if (reduceMotion) {
      uniforms.uTime.value = 30; // pleasant static frame
      renderer.render(scene, camera);
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`three-bg ${className ?? ''}`} aria-hidden="true" />;
};

export default ThreeBackground;
