'use client'

import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";
import { fragment, vertex } from "@/constants/bgcode";
import CreateFormAI from "@/components/home/module/CreateFormAI";
import { Badge } from "@/components/ui/badge";

type Props = {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
};

export default function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0,
  scanlineIntensity = 0,
  speed = 0.5,
  scanlineFrequency = 0,
  warpAmount = 0,
  resolutionScale = 1,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current as HTMLCanvasElement;
    const parent = canvas.parentElement as HTMLElement;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas,
    });

    const gl = renderer.gl;
    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uHueShift: { value: hueShift },
        uNoise: { value: noiseIntensity },
        uScan: { value: scanlineIntensity },
        uScanFreq: { value: scanlineFrequency },
        uWarp: { value: warpAmount },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = parent.clientWidth,
        h = parent.clientHeight;
      renderer.setSize(w * resolutionScale, h * resolutionScale);
      program.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", resize);
    resize();

    const start = performance.now();
    let frame = 0;

    const loop = () => {
      program.uniforms.uTime.value =
        ((performance.now() - start) / 1000) * speed;
      program.uniforms.uHueShift.value = hueShift;
      program.uniforms.uNoise.value = noiseIntensity;
      program.uniforms.uScan.value = scanlineIntensity;
      program.uniforms.uScanFreq.value = scanlineFrequency;
      program.uniforms.uWarp.value = warpAmount;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [
    hueShift,
    noiseIntensity,
    scanlineIntensity,
    speed,
    scanlineFrequency,
    warpAmount,
    resolutionScale,
  ]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Canvas */}
      <canvas ref={ref} className="absolute inset-0 w-full h-full block" />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 min-h-screen">
        {/* Badge */}
        <Badge variant="outline" className="mb-6 px-4 py-1 text-sm bg-white/10 text-white">
          🚀 AI-Powered Form Builder
        </Badge>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow mb-6">
          Build Smarter Forms with <span className="text-violet-300">AI</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-12">
          Stop wasting time on manual form creation. With our AI Form Builder,
          you can generate, customize, and launch interactive forms in seconds —
          simple, fast, and efficient.
        </p>

        {/* Main Component */}
        <div className="w-full max-w-2xl">
          <CreateFormAI />
        </div>
      </div>
    </div>
  );
}
