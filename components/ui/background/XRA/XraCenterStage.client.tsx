"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const blobVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const blobFragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uPointer;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float d = length(uv);
    float radius = 0.64;
    float edge = d - radius;

    float edgeMask = smoothstep(0.18, 0.02, abs(edge));

    vec2 p = uv * 3.2 + vec2(uTime * 0.18, uTime * 0.14);
    float n = fbm(p + uPointer * 0.9);
    float wobble = (n - 0.5) * 0.16 * uHover * edgeMask;

    vec2 dir = normalize(uPointer + vec2(0.0001));
    float alignment = dot(normalize(uv + vec2(0.0001)), dir);
    float pinch = exp(-pow(1.0 - alignment, 2.0) * 14.0) * clamp(length(uPointer), 0.0, 1.0) * 0.12 * uHover * edgeMask;

    float e = edge + wobble - pinch;
    float alpha = 1.0 - smoothstep(-0.008, 0.02, e);
    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
  }
`;

function BlobPlane({
  hover,
  pointer,
}: {
  hover: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<THREE.Vector2>;
}) {
  const [uniforms] = useState<Record<string, THREE.IUniform>>(() => ({
    uTime: { value: 0 },
    uHover: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
  }));

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uHover.value = hover.current;
    (materialRef.current.uniforms.uPointer.value as THREE.Vector2).copy(pointer.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        uniforms={uniforms}
        vertexShader={blobVertexShader}
        fragmentShader={blobFragmentShader}
      />
    </mesh>
  );
}

export function XraCenterStage({ className }: { className?: string }) {
  const hover = useRef(0);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const setHover = (v: number) => {
      gsap.to(hover, {
        current: v,
        duration: 0.55,
        ease: v > hover.current ? "power3.out" : "power3.inOut",
      });
    };

    const onEnter = () => setHover(1);
    const onLeave = () => {
      gsap.to(pointer.current, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });
      setHover(0);
    };
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      gsap.to(pointer.current, { x: nx * 0.65, y: -ny * 0.65, duration: 0.18, ease: "power2.out" });
    };

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointermove", onMove);

    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section className={cn("relative isolate flex w-full items-center justify-center", className)}>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[min(84vh,820px)] w-[min(84vw,980px)] bg-[radial-gradient(closest-side_at_50%_48%,rgba(255,255,255,0.92),rgba(255,255,255,0.55)_56%,transparent_74%)]" />
      </div>

      <div className="relative flex items-center justify-center">
        <div
          ref={hostRef}
          className="relative grid place-items-center"
          style={{
            width: "clamp(240px, 28vw, 380px)",
            height: "clamp(240px, 28vw, 380px)",
          }}
          role="img"
          aria-label="XRAK Studio interactive blob"
        >
          <Canvas
            orthographic
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 2], zoom: 120 }}
            gl={{ alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: "low-power" }}
            className="absolute inset-0"
          >
            <BlobPlane hover={hover} pointer={pointer} />
          </Canvas>

          <h1 className="pointer-events-none relative z-10 select-none text-center text-white mix-blend-difference">
            <span className="block font-semibold leading-[0.86] tracking-[-0.06em] text-[clamp(52px,7.4vw,96px)] translate-x-[-0.06em]">
              XRAK
            </span>
            <span className="block font-medium uppercase leading-none tracking-[0.34em] text-[clamp(20px,2.3vw,30px)] translate-x-[0.12em] mt-2">
              Studio
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
