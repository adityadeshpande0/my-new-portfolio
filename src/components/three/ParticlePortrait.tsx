"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/random";

export interface ParticlePortraitProps {
  src: string;
  active: boolean;
  /** Called once the particles have been built, so the static photo underneath can fade out. */
  onReady?: () => void;
}

/** Columns sampled from the photo; rows follow the image's aspect ratio. */
const COLS = 112;

interface PortraitData {
  home: Float32Array;
  scatter: Float32Array;
  color: Float32Array;
  lum: Float32Array;
  seed: Float32Array;
  edge: Float32Array;
  count: number;
}

/** Samples the photo on a grid: colour, luminance and a soft elliptical vignette per dot. */
function samplePortrait(img: HTMLImageElement): PortraitData {
  const rows = Math.round((COLS * img.naturalHeight) / img.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = COLS;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.drawImage(img, 0, 0, COLS, rows);
  const px = ctx.getImageData(0, 0, COLS, rows).data;
  const rand = mulberry32(11);

  const home: number[] = [];
  const scatter: number[] = [];
  const color: number[] = [];
  const lum: number[] = [];
  const seed: number[] = [];
  const edge: number[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < COLS; x++) {
      // Normalised position, centred, y up; small jitter breaks up the grid.
      const nx = (x + 0.5) / COLS - 0.5 + (rand() - 0.5) * (0.35 / COLS);
      const ny = 0.5 - (y + 0.5) / rows + (rand() - 0.5) * (0.35 / rows);
      // Elliptical vignette centred on the face: edges dissolve instead of ending in a hard rectangle.
      const ex = nx / 0.5;
      const ey = (ny - 0.06) / 0.56;
      const e = Math.sqrt(ex * ex + ey * ey);
      const keep = 1 - THREE.MathUtils.smoothstep(e, 0.72, 1.08);
      if (rand() > keep + 0.04) continue;

      const i = (y * COLS + x) * 4;
      const r = px[i] / 255;
      const g = px[i + 1] / 255;
      const b = px[i + 2] / 255;
      home.push(nx, ny);
      const a = rand() * Math.PI * 2;
      const rad = 0.55 + rand() * 0.6;
      scatter.push(Math.cos(a) * rad, Math.sin(a) * rad * 0.8);
      color.push(r, g, b);
      lum.push(0.2126 * r + 0.7152 * g + 0.0722 * b);
      seed.push(rand());
      edge.push(keep);
    }
  }

  return {
    home: new Float32Array(home),
    scatter: new Float32Array(scatter),
    color: new Float32Array(color),
    lum: new Float32Array(lum),
    seed: new Float32Array(seed),
    edge: new Float32Array(edge),
    count: lum.length,
  };
}

const vertex = /* glsl */ `
  attribute vec2 aHome;
  attribute vec2 aScatter;
  attribute vec3 aColor;
  attribute float aLum;
  attribute float aSeed;
  attribute float aEdge;
  uniform vec2 uSize;
  uniform float uSpacing;
  uniform float uForm;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uRadius;
  uniform float uPixelRatio;
  uniform vec3 uDark;
  uniform vec3 uLight;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Assemble from a scattered cloud, each dot on its own slight delay.
    float f = clamp((uForm - aSeed * 0.45) / 0.55, 0.0, 1.0);
    f = 1.0 - pow(1.0 - f, 3.0);
    vec2 pos = mix(aScatter * uSize, aHome * uSize, f);

    // Gentle idle shimmer.
    pos += vec2(sin(uTime * 0.9 + aSeed * 50.0), cos(uTime * 0.8 + aSeed * 40.0)) * uSpacing * 0.14;

    // Cursor: dots part and swirl around the pointer, like stirring liquid.
    vec2 d = pos - uMouse;
    float dist = length(d);
    float infl = smoothstep(uRadius, 0.0, dist) * uHover;
    vec2 dir = d / max(dist, 0.001);
    pos += dir * infl * infl * uRadius * 0.24;
    pos += vec2(-dir.y, dir.x) * infl * uSpacing * 4.5 * sin(uTime * 1.8 + aSeed * 6.2831);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);

    // Halftone: brighter areas get bigger dots; dots swell slightly under the cursor.
    float size = uSpacing * (0.28 + 1.15 * pow(aLum, 1.05));
    gl_PointSize = size * uPixelRatio * (1.0 + infl * 0.7) * mix(0.5, 1.0, f);

    // ~60% amber duotone at rest; full colour under the cursor.
    vec3 duo = mix(uDark, uLight, smoothstep(0.03, 0.85, aLum));
    vec3 rest = mix(aColor, duo, 0.6);
    vColor = mix(rest, aColor, clamp(uHover * 0.3 + infl * 0.7, 0.0, 1.0)) * 1.12;
    vAlpha = aEdge * mix(0.25, 1.0, f);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.32, d) * vAlpha);
  }
`;

// Raw sRGB values: the shader writes colours straight to the canvas, like the sampled photo pixels.
const DARK = new THREE.Vector3(0x14 / 255, 0x14 / 255, 0x16 / 255);
const LIGHT = new THREE.Vector3(0xe8 / 255, 0xa1 / 255, 0x5c / 255);

function Dots({ data, formed }: { data: PortraitData; formed: boolean }) {
  const { gl, size } = useThree();
  const target = useRef(new THREE.Vector2(0, 0));
  const hoverTarget = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // `position` is unused by the shader but required for three's draw-range and bounds.
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(data.count * 3), 3));
    g.setAttribute("aHome", new THREE.BufferAttribute(data.home, 2));
    g.setAttribute("aScatter", new THREE.BufferAttribute(data.scatter, 2));
    g.setAttribute("aColor", new THREE.BufferAttribute(data.color, 3));
    g.setAttribute("aLum", new THREE.BufferAttribute(data.lum, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(data.seed, 1));
    g.setAttribute("aEdge", new THREE.BufferAttribute(data.edge, 1));
    return g;
  }, [data]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uSize: { value: new THREE.Vector2(1, 1) },
          uSpacing: { value: 1 },
          uForm: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uHover: { value: 0 },
          uRadius: { value: 80 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
          uDark: { value: DARK },
          uLight: { value: LIGHT },
        },
        transparent: true,
        depthWrite: false,
      }),
    [gl],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  // Track the cursor in canvas pixels (centred, y up) only while it is over the portrait.
  useEffect(() => {
    const el = gl.domElement;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.current.set(e.clientX - r.left - r.width / 2, -(e.clientY - r.top - r.height / 2));
      hoverTarget.current = 1;
    };
    const leave = () => {
      hoverTarget.current = 0;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    (u.uSize.value as THREE.Vector2).set(size.width, size.height);
    u.uSpacing.value = size.width / COLS;
    u.uRadius.value = size.width * 0.22;
    u.uTime.value = state.clock.elapsedTime;
    u.uForm.value += ((formed ? 1 : 0) - u.uForm.value) * Math.min(1, delta * 0.85);
    u.uHover.value += (hoverTarget.current - u.uHover.value) * Math.min(1, delta * 4);
    (u.uMouse.value as THREE.Vector2).lerp(target.current, Math.min(1, delta * 10));
  });

  return <points geometry={geometry} material={material} />;
}

export default function ParticlePortrait({ src, active, onReady }: ParticlePortraitProps) {
  const [data, setData] = useState<PortraitData | null>(null);
  const [formed, setFormed] = useState(false);

  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!alive) return;
      setData(samplePortrait(img));
      onReady?.();
    };
    img.src = src;
    return () => {
      alive = false;
    };
  }, [src, onReady]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- assemble the first time we're on screen
    if (active) setFormed(true);
  }, [active]);

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 1 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, alpha: true }}
    >
      {data && <Dots data={data} formed={formed} />}
    </Canvas>
  );
}
