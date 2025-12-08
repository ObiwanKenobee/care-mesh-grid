import { MapPin, Users, Shield } from "lucide-react";

const pillars = [
  {
    icon: MapPin,
    title: "Radical Proximity",
    legacy: "She insisted on going physically where suffering is densest.",
    modern: "Hyper-local sensing networks that detect distress in real-time.",
    color: "terracotta",
  },
  {
    icon: Users,
    title: "Distributed Small Units",
    legacy: "Her model scaled through tiny houses, not giant institutions.",
    modern: "Micro-hubs that operate independently yet connect seamlessly.",
    color: "amber",
  },
  {
    icon: Shield,
    title: "Unconditional Welcome",
    legacy: "She created psychological safety before service.",
    modern: "Trust-first interaction protocols that preserve dignity.",
    color: "forest",
  },
];

const Pillars = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
      
      <div className="container relative z-10 px-6">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-sm uppercase tracking-widest text-terracotta font-medium mb-4 block">
            The Foundation
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            Three Pillars of Compassion
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Functional strengths from a historical hero, translated into modern architecture.
          </p>
        </div>
        
        {/* Pillars grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 ${
                pillar.color === 'terracotta' ? 'bg-terracotta/15 text-terracotta' :
                pillar.color === 'amber' ? 'bg-amber/15 text-amber' :
                'bg-forest/15 text-forest'
              }`}>
                <pillar.icon className="w-7 h-7" />
              </div>
              
              {/* Title */}
              <h3 className="font-serif text-xl md:text-2xl font-semibold mb-4">
                {pillar.title}
              </h3>
              
              {/* Legacy quote */}
              <div className="mb-4 pb-4 border-b border-border/50">
                <span className="text-xs uppercase tracking-wider text-muted-foreground/60 block mb-2">Her Method</span>
                <p className="text-muted-foreground italic text-sm leading-relaxed">
                  "{pillar.legacy}"
                </p>
              </div>
              
              {/* Modern translation */}
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground/60 block mb-2">Modern Translation</span>
                <p className="text-foreground/90 text-sm leading-relaxed">
                  {pillar.modern}
                </p>
              </div>
              
              {/* Decorative corner */}
              <div className={`absolute top-0 right-0 w-20 h-20 opacity-5 ${
                pillar.color === 'terracotta' ? 'bg-terracotta' :
                pillar.color === 'amber' ? 'bg-amber' :
                'bg-forest'
              } rounded-bl-[4rem] rounded-tr-2xl`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
