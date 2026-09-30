"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export interface IcosahedronBgProps {
  highlighted: boolean;
  active: boolean;
}

const BASE = new THREE.Color("#EDEDED");
const ACCENT = new THREE.Color("#E8A15C");

function Ico({ highlighted }: { highlighted: boolean }) {
  const mesh = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.4, 1)), []);
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: BASE.clone(), transparent: true, opacity: 0.1 }),
    [],
  );
  const mix = useRef(0);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.05;
    mesh.current.rotation.y += delta * (0.08 + mix.current * 0.12);
    mix.current += ((highlighted ? 1 : 0) - mix.current) * Math.min(1, delta * 3);
    material.color.copy(BASE).lerp(ACCENT, mix.current);
    material.opacity = 0.09 + mix.current * 0.16;
  });

  return <lineSegments ref={mesh} geometry={geometry} material={material} />;
}

export default function IcosahedronBg({ highlighted, active }: IcosahedronBgProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ alpha: true }}
    >
      <Ico highlighted={highlighted} />
    </Canvas>
  );
}
