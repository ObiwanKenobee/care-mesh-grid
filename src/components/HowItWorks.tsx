import { Sun, Radio, BookOpen, Zap, MessageCircle } from "lucide-react";

const components = [
  {
    icon: Sun,
    title: "Micro-Hub Pods",
    description: "Small, rugged kiosks staffed by local volunteers with solar power, water filters, cold storage, and edge AI. First-line services: maternal health, nutrition screening, trauma counseling.",
    accent: "terracotta",
  },
  {
    icon: Radio,
    title: "Social Sensing Mesh",
    description: "Communities input anonymous distress signals via simple icons on basic phones. Edge AI spots spikes in hunger, disease, violence, or displacement. Alerts dispatch mobile teams.",
    accent: "amber",
  },
  {
    icon: BookOpen,
    title: "Compassion Ledger",
    description: "A lightweight blockchain ledger logs supplies, volunteers, and activities — eliminating corruption, protecting dignity, and allowing donors to see impact without voyeurism.",
    accent: "forest",
  },
  {
    icon: Zap,
    title: "Mobile Response Swarms",
    description: "Trained youth groups carrying rapid kits: nutrition, first aid, telehealth tablets, water testing. Inspired by Missionaries of Charity mobility.",
    accent: "terracotta",
  },
  {
    icon: MessageCircle,
    title: "AI Companion for the Forgotten",
    description: "A calm, simple voice interface speaking local languages, offering reassurance, triage, and referral. Kindness encoded, not clinical coldness.",
    accent: "amber",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container relative z-10 px-6">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-sm uppercase tracking-widest text-forest font-medium mb-4 block">
            The Architecture
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Five integrated components forming a survival infrastructure layer for humanity's most fragile communities.
          </p>
        </div>
        
        {/* Components list */}
        <div className="max-w-4xl mx-auto space-y-6">
          {components.map((component, index) => (
            <div
              key={component.title}
              className="group flex gap-6 items-start p-6 md:p-8 bg-card/30 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:bg-card/50 transition-all duration-300"
            >
              {/* Number and icon */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground/60">0{index + 1}</span>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  component.accent === 'terracotta' ? 'bg-terracotta/15 text-terracotta' :
                  component.accent === 'amber' ? 'bg-amber/15 text-amber' :
                  'bg-forest/15 text-forest'
                }`}>
                  <component.icon className="w-6 h-6" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3 group-hover:text-gradient-warm transition-all">
                  {component.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {component.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
