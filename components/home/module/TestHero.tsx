'use client'
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronRight, Sparkles, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

function GetStartedButton() {
  return (
    <Link href={'/sign-in'}>
    <Button className="group relative overflow-hidden brand-bg hover:bg-violet-600" size="lg">
      <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
        Get Started
      </span>
      <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
        <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
      </i>
    </Button>
    </Link>
  );
}




interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

const AnimatedTextCycle: React.FC<AnimatedTextCycleProps> = ({
  words,
  interval = 3000,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentIndex}
        className={cn("inline-block", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {words[currentIndex]}
      </motion.span>
    </AnimatePresence>
  );
};

interface Dot {
  x: number;
  y: number;
  opacity: number;
  targetOpacity: number;
}

const AIFormBuilderHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const dotsRef = useRef<Dot[]>([]);
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const DOT_SPACING = 30;
  const INTERACTION_RADIUS = 120;

  const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePositionRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  const createDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const { width, height } = canvas;
    const newDots: Dot[] = [];
    
    for (let x = 0; x < width; x += DOT_SPACING) {
      for (let y = 0; y < height; y += DOT_SPACING) {
        newDots.push({
          x: x + DOT_SPACING / 2,
          y: y + DOT_SPACING / 2,
          opacity: Math.random() * 0.3 + 0.1,
          targetOpacity: Math.random() * 0.3 + 0.1,
        });
      }
    }
    dotsRef.current = newDots;
  }, []);

  const animateDots = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const { x: mouseX, y: mouseY } = mousePositionRef.current;

    dotsRef.current.forEach((dot) => {
      let finalOpacity = dot.opacity;
      
      if (mouseX !== null && mouseY !== null) {
        const distance = Math.sqrt((dot.x - mouseX) ** 2 + (dot.y - mouseY) ** 2);
        if (distance < INTERACTION_RADIUS) {
          const influence = 1 - distance / INTERACTION_RADIUS;
          finalOpacity = Math.min(1, dot.opacity + influence * 0.6);
        }
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(59, 130, 246, ${finalOpacity})`;
      ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animateDots);
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createDots();
  }, [createDots]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId.current = requestAnimationFrame(animateDots);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleResize, handleMouseMove, animateDots]);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 z-1" />

    

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full   border border-[#6e40f7]/20  text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Form Creation
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Build{" "}
            <span className="text-primary">
              <AnimatedTextCycle
                words={["Smart", "Dynamic", "Intelligent", "Adaptive", "Powerful"]}
              className="bg-gradient-to-r from-[#6e40f7] to-accent bg-clip-text text-transparent"

              />
            </span>
            <br />
            Forms in Minutes
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Create beautiful, responsive forms with AI assistance. No coding required. 
            Advanced logic, real-time validation, and seamless integrations included.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <GetStartedButton/>
            
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            className="text-sm text-muted-foreground mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            ✨ No credit card required • 🚀 Deploy instantly • 🔒 Enterprise-grade security
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow">
              <Zap className="h-12 w-12  brand-text mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Generate forms from natural language descriptions in seconds
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 brand-text mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-muted-foreground">
                GDPR, HIPAA, and SOC 2 compliant with enterprise security
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 brand-text mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Real-time collaboration with advanced permission controls
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-3xl" />
            <div className="relative bg-card border border-border rounded-lg p-2 shadow-2xl">
              <img
                src="/main.jpg"
                alt="AI Form Builder Interface"
                className="w-full h-auto rounded-md"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AIFormBuilderHero;
