"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/random";

export interface ParticleMonogramProps {
  text: string;
  active: boolean;
}

const COUNT = 1500;

/** Samples COUNT points from text rendered to an offscreen canvas. */
function sampleText(text: string, fontFamily: string, rand: () => number): Float32Array {
  const w = 480;
  const h = 240;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const out = new Float32Array(COUNT * 3);
  if (!ctx) return out;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 200px ${fontFamily}`;
  ctx.fillText(text, w / 2, h / 2 + 8);
  const data = ctx.getImageData(0, 0, w, h).data;
  const filled: number[] = [];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  const n = filled.length / 2;
  for (let i = 0; i < COUNT; i++) {
    const k = n ? Math.floor(rand() * n) : 0;
    out[i * 3] = ((filled[k * 2] ?? w / 2) / w - 0.5) * 4.8;
    out[i * 3 + 1] = -((filled[k * 2 + 1] ?? h / 2) / h - 0.5) * 2.4 + 0.1;
    out[i * 3 + 2] = (rand() - 0.5) * 0.15;
  }
  return out;
}

const vertex = /* glsl */ `
  attribute vec3 aScatter;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    float delay = aSeed * 0.35;
    float p = clamp((uProgress - delay) / (1.0 - 0.35), 0.0, 1.0);
    p = 1.0 - pow(1.0 - p, 3.0);
    vec3 pos = mix(aScatter, position, p);
    pos.x += sin(uTime * 0.8 + aSeed * 40.0) * 0.012;
    pos.y += cos(uTime * 0.7 + aSeed * 30.0) * 0.012;
    // Cursor repulsion.
    vec2 diff = pos.xy - uMouse;
    float dist = length(diff);
    float force = smoothstep(0.55, 0.0, dist) * 0.35;
    pos.xy += normalize(diff + 1e-5) * force;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + aSeed * 1.8) * uPixelRatio * (4.0 / -mv.z);
    vAlpha = mix(0.25, 0.95, p) * (0.55 + aSeed * 0.45);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.1, d) * vAlpha);
  }
`;

function Particles({ text, target }: { text: string; target: number }) {
  const { gl, viewport } = useThree();
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => alive && setFontReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const geometry = useMemo(() => {
    if (!fontReady) return null;
    const family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim() || "monospace";
    const rand = mulberry32(42);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(sampleText(text, family, rand), 3));
    const scatter = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.5 + rand() * 3;
      const a = rand() * Math.PI * 2;
      scatter[i * 3] = Math.cos(a) * r;
      scatter[i * 3 + 1] = Math.sin(a) * r * 0.6;
      scatter[i * 3 + 2] = (rand() - 0.5) * 3;
      seed[i] = rand();
    }
    g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [fontReady, text]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(99, 99) },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
          uColor: { value: new THREE.Color("#E8A15C") },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [gl],
  );

  useEffect(() => () => geometry?.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  const mouse = useRef(new THREE.Vector2(99, 99));
  const aim = useRef(new THREE.Vector2(99, 99));

  // Track the real cursor only while it is over the canvas (R3F's pointer defaults to centre).
  useEffect(() => {
    const el = gl.domElement;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      aim.current.set((nx * viewport.width) / 2, (ny * viewport.height) / 2);
    };
    const leave = () => aim.current.set(99, 99);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [gl, viewport.width, viewport.height]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    u.uProgress.value += (target - u.uProgress.value) * Math.min(1, delta * 0.9);
    u.uTime.value = state.clock.elapsedTime;
    mouse.current.lerp(aim.current, Math.min(1, delta * 8));
    (u.uMouse.value as THREE.Vector2).copy(mouse.current);
  });

  if (!geometry) return null;
  return <points geometry={geometry} material={material} />;
}

export default function ParticleMonogram({ text, active }: ParticleMonogramProps) {
  const [formed, setFormed] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- form the letters the first time we're on screen
    if (active) setFormed(true);
  }, [active]);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: false, alpha: true }}
    >
      <Particles text={text} target={formed ? 1 : 0} />
    </Canvas>
  );
}
