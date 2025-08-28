import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full brand-bg/60 border border-primary/20">
              <Sparkles className="h-4 w-4 brand-text" />
              <span className="text-sm font-medium brand-text   ">AI-Powered Form Creation</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Build Perfect Forms with{" "}
              <span className="brand-bg bg-clip-text text-transparent">
                AI Magic
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Create stunning, intelligent forms in seconds. Our AI understands your needs and builds professional forms automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href={'/create-form'}>
              <Button variant="hero" size="lg" className="group">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              </Link>
              <Button  size="lg">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>Free forever plan</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="relative z-10">
              <img 
                src={'/hero.jpg'} 
                alt="AI Form Builder Interface" 
                className="w-full h-auto rounded-2xl shadow-elegant animate-glow-pulse"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-72 h-72 brand-bg opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-64 h-64 brand-bg opacity-20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;