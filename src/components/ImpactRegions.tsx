import { MapPin } from "lucide-react";
import ImpactMap from "./ImpactMap";

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
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
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
          
          {/* Interactive Map */}
          <div className="mb-12">
            <ImpactMap />
          </div>
          
          {/* Regions grid - condensed */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {regions.map((region) => (
              <div
                key={region.name}
                className="group flex items-center gap-3 p-4 bg-card/20 backdrop-blur-sm border border-border/50 rounded-xl hover:border-terracotta/30 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-terracotta" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-muted-foreground/60 block">
                    {region.type}
                  </span>
                  <h3 className="text-sm font-medium text-foreground truncate group-hover:text-terracotta transition-colors">
                    {region.name}
                  </h3>
                </div>
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
