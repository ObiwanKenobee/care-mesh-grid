import { Button } from "@/components/ui/button";
import { Heart, ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grain">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-terracotta/20 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber/15 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-forest/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '0.8s' }} />
      
      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border mb-8 opacity-0 animate-fade-up">
            <Heart className="w-4 h-4 text-terracotta" />
            <span className="text-sm text-muted-foreground font-medium">Compassion as Infrastructure</span>
          </div>
          
          {/* Main headline */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6 opacity-0 animate-fade-up stagger-1">
            The{" "}
            <span className="text-gradient-warm">Compassion</span>
            <br />
            Infrastructure Engine
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 opacity-0 animate-fade-up stagger-2 font-light">
            A humanitarian mesh-grid for extreme environments
          </p>
          
          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground/80 max-w-xl mx-auto mb-10 opacity-0 animate-fade-up stagger-3">
            Inspired by Mother Teresa's real superpower: building micro-networks of care that survive chaos.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-up stagger-4">
            <Button variant="hero" size="xl">
              Explore the Vision
            </Button>
            <Button variant="heroOutline" size="xl">
              Read the Whitepaper
            </Button>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up stagger-5">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
              <span className="text-xs uppercase tracking-widest">Discover</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
