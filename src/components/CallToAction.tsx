import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-terracotta/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="container relative z-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-terracotta to-amber mb-8 shadow-lg">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          
          {/* Headline */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            Join the Movement
          </h2>
          
          {/* Description */}
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            This isn't a charity app. It's a survival infrastructure layer for humanity's most fragile communities. 
            Be part of building compassion as a utility.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group">
              Get Involved
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Partner With Us
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground/60 mb-4">
              Designed for extreme resilience
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest" />
                Solar Powered
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-terracotta" />
                Low Bandwidth
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber" />
                Edge AI
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest" />
                Community First
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
