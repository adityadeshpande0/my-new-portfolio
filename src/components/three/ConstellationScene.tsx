"use client";

import { Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/random";

export interface ConstellationSceneProps {
  /** 0 → loose cloud, ~0.6 → three clusters, 1 → faded out. */
  progress: MotionValue<number>;
  /** Fades the scene up once the intro has finished. */
  visible: boolean;
  tier: "low" | "high";
  active: boolean;
}

const CLUSTERS = [
  { label: "Frontend", center: new THREE.Vector3(-2.5, 0.35, 0) },
  { label: "Backend", center: new THREE.Vector3(0, -0.35, -0.4) },
  { label: "Cloud", center: new THREE.Vector3(2.5, 0.35, 0) },
] as const;

const AMBER = new THREE.Color("#E8A15C");

interface Graph {
  cloud: Float32Array;
  cluster: Float32Array;
  phase: Float32Array;
  alpha: Float32Array;
  size: Float32Array;
  group: Uint8Array;
  intra: Uint16Array;
  inter: Uint16Array;
}

function buildGraph(count: number): Graph {
  const rand = mulberry32(7);
  const cloud = new Float32Array(count * 3);
  const cluster = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const alpha = new Float32Array(count);
  const size = new Float32Array(count);
  const group = new Uint8Array(count);

  for (let i = 0; i < count; i++) {
    // Loose ellipsoid cloud, biased right so it frames the hero text.
    const u = rand() * Math.PI * 2;
    const v = Math.acos(2 * rand() - 1);
    const r = Math.cbrt(rand());
    cloud[i * 3] = Math.sin(v) * Math.cos(u) * r * 4.6 + 0.9;
    cloud[i * 3 + 1] = Math.sin(v) * Math.sin(u) * r * 2.5;
    cloud[i * 3 + 2] = Math.cos(v) * r * 2.2;

    const g = i % 3;
    group[i] = g;
    const c = CLUSTERS[g].center;
    const cu = rand() * Math.PI * 2;
    const cv = Math.acos(2 * rand() - 1);
    const cr = Math.pow(rand(), 0.6) * 0.95;
    cluster[i * 3] = c.x + Math.sin(cv) * Math.cos(cu) * cr;
    cluster[i * 3 + 1] = c.y + Math.sin(cv) * Math.sin(cu) * cr * 0.9;
    cluster[i * 3 + 2] = c.z + Math.cos(cv) * cr;

    phase[i] = rand() * Math.PI * 2;
    alpha[i] = 0.35 + rand() * 0.65;
    size[i] = 0.6 + Math.pow(rand(), 3) * 1.6;
  }

  // Edges: each node links to its 2 nearest neighbours in the cloud.
  const intra: number[] = [];
  const inter: number[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < count; i++) {
    const dists: Array<[number, number]> = [];
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const dx = cloud[i * 3] - cloud[j * 3];
      const dy = cloud[i * 3 + 1] - cloud[j * 3 + 1];
      const dz = cloud[i * 3 + 2] - cloud[j * 3 + 2];
      dists.push([dx * dx + dy * dy + dz * dz, j]);
    }
    dists.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < 2; k++) {
      const j = dists[k][1];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      (group[i] === group[j] ? intra : inter).push(i, j);
    }
  }
  // Give every cluster an internal spine so the modules read as graphs too.
  for (let g = 0; g < 3; g++) {
    const members: number[] = [];
    for (let i = g; i < count; i += 3) members.push(i);
    for (let k = 0; k < members.length - 1; k += 2) intra.push(members[k], members[k + 1]);
  }

  return {
    cloud,
    cluster,
    phase,
    alpha,
    size,
    group,
    intra: new Uint16Array(intra),
    inter: new Uint16Array(inter),
  };
}

const pointVertex = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  uniform float uPixelRatio;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * 9.0 * uPixelRatio * (6.0 / -mv.z);
    vAlpha = aAlpha * uOpacity;
  }
`;

const pointFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 3.0);
    gl_FragColor = vec4(uColor * (0.6 + glow * 1.4), (core * 0.55 + glow) * vAlpha);
  }
`;

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function Constellation({ progress, visible, tier }: Omit<ConstellationSceneProps, "active">) {
  const count = tier === "high" ? 110 : 42;
  const graph = useMemo(() => buildGraph(count), [count]);
  const { camera, gl } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const fade = useRef(0);
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);

  const positions = useMemo(() => new Float32Array(graph.cloud), [graph]);

  const pointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(graph.alpha, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(graph.size, 1));
    return g;
  }, [graph, positions]);

  const makeLines = (index: Uint16Array) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", pointsGeo.getAttribute("position"));
    g.setIndex(new THREE.BufferAttribute(index, 1));
    return g;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- derived from pointsGeo
  const intraGeo = useMemo(() => makeLines(graph.intra), [pointsGeo]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- derived from pointsGeo
  const interGeo = useMemo(() => makeLines(graph.inter), [pointsGeo]);

  const pointMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        uniforms: {
          uColor: { value: AMBER },
          uOpacity: { value: 0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [gl],
  );
  const intraMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const interMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0, depthWrite: false }),
    [],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      pointer.current.x = Math.max(-1, Math.min(1, e.gamma / 30));
      pointer.current.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  useEffect(
    () => () => {
      [pointsGeo, intraGeo, interGeo, pointMat, intraMat, interMat].forEach((o) => o.dispose());
    },
    [pointsGeo, intraGeo, interGeo, pointMat, intraMat, interMat],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = progress.get();
    const gather = smoothstep(0.06, 0.36, p);
    const exit = 1 - smoothstep(0.5, 0.72, p);
    fade.current += ((visible ? 1 : 0) - fade.current) * Math.min(1, delta * 1.4);
    const opacity = fade.current * exit;

    const { cloud, cluster, phase } = graph;
    const drift = 0.14 * (1 - gather * 0.6);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ph = phase[i];
      positions[i3] = cloud[i3] + (cluster[i3] - cloud[i3]) * gather + Math.sin(t * 0.35 + ph) * drift;
      positions[i3 + 1] =
        cloud[i3 + 1] + (cluster[i3 + 1] - cloud[i3 + 1]) * gather + Math.cos(t * 0.3 + ph * 1.3) * drift;
      positions[i3 + 2] =
        cloud[i3 + 2] + (cluster[i3 + 2] - cloud[i3 + 2]) * gather + Math.sin(t * 0.25 + ph * 0.7) * drift;
    }
    pointsGeo.getAttribute("position").needsUpdate = true;

    pointMat.uniforms.uOpacity.value = opacity;
    intraMat.opacity = 0.085 * opacity;
    interMat.opacity = 0.085 * opacity * (1 - gather);

    // Camera leans toward the cursor, lerped.
    camera.position.x += (pointer.current.x * 0.6 - camera.position.x) * Math.min(1, delta * 2);
    camera.position.y += (-pointer.current.y * 0.35 - camera.position.y) * Math.min(1, delta * 2);
    camera.lookAt(0, 0, 0);

    const labelOpacity = smoothstep(0.24, 0.36, p) * exit * fade.current;
    labelRefs.current.forEach((el) => {
      if (el) el.style.opacity = String(labelOpacity);
    });
  });

  return (
    <group>
      <lineSegments geometry={interGeo} material={interMat} />
      <lineSegments geometry={intraGeo} material={intraMat} />
      <points geometry={pointsGeo} material={pointMat} />
      {CLUSTERS.map((c, i) => (
        <Html
          key={c.label}
          position={[c.center.x, c.center.y + 1.3, c.center.z]}
          center
          zIndexRange={[1, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="type-label whitespace-nowrap text-accent"
            style={{ opacity: 0 }}
          >
            …/{c.label}…
          </div>
        </Html>
      ))}
    </group>
  );
}

export default function ConstellationScene({ progress, visible, tier, active }: ConstellationSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: tier === "high", alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Constellation progress={progress} visible={visible} tier={tier} />
      {tier === "high" && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur radius={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
