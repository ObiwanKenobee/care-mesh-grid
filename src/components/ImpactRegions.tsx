import { MapPin } from "lucide-react";

const regions = [
  { name: "Sudan's famine arc", type: "Crisis Zone" },
  { name: "Somalia drought belt", type: "Climate Emergency" },
  { name: "Rohingya camps, Cox's Bazar", type: "Refugee Settlement" },
  { name: "CAR conflict zones", type: "Conflict Zone" },
  { name: "Kibera, Mathare, Kayole", type: "Urban Density" },
  { name: "Mountainous Nepal", type: "Remote Access" },
];

const ImpactRegions = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container relative z-10 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-widest text-terracotta font-medium mb-4 block">
              Where It Starts
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              Impact Regions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              The kind of system that survives when governments collapse, internet dies, or cities burn.
            </p>
          </div>
          
          {/* Regions grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((region, index) => (
              <div
                key={region.name}
                className="group relative p-6 bg-card/30 backdrop-blur-sm border border-border rounded-xl hover:border-terracotta/40 hover:bg-card/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground/60 block mb-1">
                      {region.type}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-terracotta transition-colors">
                      {region.name}
                    </h3>
                  </div>
                </div>
                
                {/* Pulse indicator */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              </div>
            ))}
          </div>
          
          {/* Callout */}
          <div className="mt-12 p-8 bg-gradient-to-r from-terracotta/10 to-amber/10 border border-terracotta/20 rounded-2xl text-center">
            <p className="font-serif text-xl md:text-2xl text-foreground/90 mb-2">
              This is a breakthrough.
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              It merges moral philosophy, frontier tech, micro-logistics, trauma psychology, and community-driven governance into a single elegant architecture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactRegions;
