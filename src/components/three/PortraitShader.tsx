"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export interface PortraitShaderProps {
  src: string;
  active: boolean;
}

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uPlane;
  uniform vec2 uImage;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform vec3 uDark;
  uniform vec3 uLight;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float planeRatio = uPlane.x / uPlane.y;
    float imageRatio = uImage.x / uImage.y;
    vec2 scale = planeRatio > imageRatio
      ? vec2(1.0, imageRatio / planeRatio)
      : vec2(planeRatio / imageRatio, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    // Ripple radiating from the cursor, only while hovered.
    vec2 toMouse = uv - uMouse;
    toMouse.x *= uPlane.x / uPlane.y;
    float d = length(toMouse);
    float wave = sin(d * 38.0 - uTime * 4.0) * exp(-d * 6.0) * 0.012 * uHover;
    uv += normalize(toMouse + 1e-5) * wave;
    // Slight zoom-in on hover.
    uv = (uv - 0.5) * (1.0 - 0.035 * uHover) + 0.5;

    vec3 color = texture2D(uMap, coverUv(uv)).rgb;
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    vec3 duo = mix(uDark, uLight, smoothstep(0.02, 0.9, luma));
    // ~60% duotone at rest, shifting to full colour under the cursor.
    vec3 rest = mix(color, duo, 0.6);
    float spot = smoothstep(0.55, 0.0, d) * uHover;
    vec3 outColor = mix(rest, color, clamp(uHover * 0.55 + spot * 0.45, 0.0, 1.0));
    // Warm vignette.
    float vig = smoothstep(1.05, 0.35, length(vUv - vec2(0.45, 0.55)));
    outColor *= mix(0.72, 1.0, vig);
    gl_FragColor = vec4(outColor, 1.0);
    #include <colorspace_fragment>
  }
`;

function PortraitPlane({ src }: { src: string }) {
  const texture = useTexture(src);
  const { viewport, size } = useThree();
  const hover = useRef(0);
  const target = useRef(0);

  const material = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    const img = texture.image as { width: number; height: number };
    return new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uMap: { value: texture },
        uPlane: { value: new THREE.Vector2(1, 1) },
        uImage: { value: new THREE.Vector2(img.width, img.height) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
        uTime: { value: 0 },
        uDark: { value: new THREE.Color("#141416") },
        uLight: { value: new THREE.Color("#E8A15C") },
      },
    });
  }, [texture]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    hover.current += (target.current - hover.current) * Math.min(1, delta * 3);
    material.uniforms.uHover.value = hover.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    (material.uniforms.uPlane.value as THREE.Vector2).set(size.width, size.height);
  });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.uv) (material.uniforms.uMouse.value as THREE.Vector2).copy(e.uv);
  };

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      material={material}
      onPointerMove={onMove}
      onPointerEnter={() => (target.current = 1)}
      onPointerLeave={() => (target.current = 0)}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
    </mesh>
  );
}

export default function PortraitShader({ src, active }: PortraitShaderProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      orthographic
      camera={{ position: [0, 0, 5], zoom: 1 }}
      gl={{ antialias: false, alpha: false }}
    >
      <PortraitPlane src={src} />
    </Canvas>
  );
}
