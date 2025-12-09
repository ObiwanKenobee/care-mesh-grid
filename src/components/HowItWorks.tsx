import { useState } from "react";
import { Sun, Radio, BookOpen, Zap, MessageCircle, X, Battery, Wifi, Users, Heart, Shield, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const components = [
  {
    icon: Sun,
    title: "Micro-Hub Pods",
    description: "Small, rugged kiosks staffed by local volunteers with solar power, water filters, cold storage, and edge AI.",
    accent: "terracotta",
    details: {
      tagline: "First-line services: maternal health, nutrition screening, trauma counseling.",
      specs: [
        { label: "Power", value: "400W Solar + 10kWh Battery", icon: Battery },
        { label: "Connectivity", value: "LoRa Mesh + Satellite Backup", icon: Wifi },
        { label: "Capacity", value: "200+ Daily Interactions", icon: Users },
      ],
      features: [
        "Water purification (500L/day)",
        "Cold chain storage for vaccines",
        "Edge AI diagnostics",
        "Offline-first architecture",
        "Modular deployment kit",
      ],
      status: { active: 47, deploying: 12, planned: 35 },
    },
  },
  {
    icon: Radio,
    title: "Social Sensing Mesh",
    description: "Communities input anonymous distress signals via simple icons on basic phones.",
    accent: "amber",
    details: {
      tagline: "Edge AI spots spikes in hunger, disease, violence, or displacement. Alerts dispatch mobile teams.",
      specs: [
        { label: "Coverage", value: "15km Radius per Node", icon: Wifi },
        { label: "Latency", value: "<30s Signal Processing", icon: Activity },
        { label: "Privacy", value: "Zero-Knowledge Proofs", icon: Shield },
      ],
      features: [
        "Icon-based reporting (no literacy required)",
        "Pattern detection algorithms",
        "Automatic alert escalation",
        "Community-owned data",
        "Works on 2G networks",
      ],
      status: { active: 156, deploying: 28, planned: 89 },
    },
  },
  {
    icon: BookOpen,
    title: "Compassion Ledger",
    description: "A lightweight blockchain ledger logs supplies, volunteers, and activities.",
    accent: "forest",
    details: {
      tagline: "Eliminating corruption, protecting dignity, and allowing donors to see impact without voyeurism.",
      specs: [
        { label: "Transparency", value: "100% Auditable", icon: Shield },
        { label: "Efficiency", value: "0.3% Overhead", icon: Activity },
        { label: "Trust", value: "Cryptographic Proof", icon: Heart },
      ],
      features: [
        "Supply chain verification",
        "Volunteer hour logging",
        "Impact attestations",
        "Privacy-preserving receipts",
        "Donor visibility dashboard",
      ],
      status: { active: 1, deploying: 0, planned: 2 },
    },
  },
  {
    icon: Zap,
    title: "Mobile Response Swarms",
    description: "Trained youth groups carrying rapid kits: nutrition, first aid, telehealth tablets, water testing.",
    accent: "terracotta",
    details: {
      tagline: "Inspired by Missionaries of Charity mobility — presence where needed most.",
      specs: [
        { label: "Response", value: "<2hr Deployment", icon: Activity },
        { label: "Team Size", value: "3-5 Trained Members", icon: Users },
        { label: "Coverage", value: "50km Operational Range", icon: Wifi },
      ],
      features: [
        "Rapid deployment protocols",
        "Standardized response kits",
        "Real-time coordination",
        "Community integration training",
        "Trauma-informed care",
      ],
      status: { active: 23, deploying: 8, planned: 45 },
    },
  },
  {
    icon: MessageCircle,
    title: "AI Companion for the Forgotten",
    description: "A calm, simple voice interface speaking local languages, offering reassurance, triage, and referral.",
    accent: "amber",
    details: {
      tagline: "Kindness encoded, not clinical coldness. Presence in isolation.",
      specs: [
        { label: "Languages", value: "47 Local Dialects", icon: MessageCircle },
        { label: "Availability", value: "24/7 Always-On", icon: Activity },
        { label: "Empathy", value: "Trauma-Informed AI", icon: Heart },
      ],
      features: [
        "Voice-first interface",
        "Emotional support protocols",
        "Crisis escalation detection",
        "Resource navigation",
        "Cultural sensitivity training",
      ],
      status: { active: 3, deploying: 2, planned: 12 },
    },
  },
];

const HowItWorks = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
        <div className="max-w-4xl mx-auto space-y-4">
          {components.map((component, index) => {
            const isExpanded = expandedIndex === index;
            const accentClasses = {
              bg: component.accent === 'terracotta' ? 'bg-terracotta/15' : component.accent === 'amber' ? 'bg-amber/15' : 'bg-forest/15',
              text: component.accent === 'terracotta' ? 'text-terracotta' : component.accent === 'amber' ? 'text-amber' : 'text-forest',
              border: component.accent === 'terracotta' ? 'border-terracotta/30' : component.accent === 'amber' ? 'border-amber/30' : 'border-forest/30',
              glow: component.accent === 'terracotta' ? 'shadow-terracotta/20' : component.accent === 'amber' ? 'shadow-amber/20' : 'shadow-forest/20',
            };

            return (
              <div
                key={component.title}
                className={cn(
                  "group bg-card/30 backdrop-blur-sm border border-border rounded-2xl transition-all duration-500 overflow-hidden",
                  isExpanded && `${accentClasses.border} shadow-lg ${accentClasses.glow}`
                )}
              >
                {/* Header - Always visible */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex gap-6 items-start p-6 md:p-8 text-left hover:bg-card/50 transition-colors"
                >
                  {/* Number and icon */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground/60">0{index + 1}</span>
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300",
                      accentClasses.bg,
                      accentClasses.text,
                      isExpanded && "scale-110"
                    )}>
                      <component.icon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className={cn(
                        "font-serif text-xl md:text-2xl font-semibold transition-all",
                        isExpanded && "text-gradient-warm"
                      )}>
                        {component.title}
                      </h3>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                        isExpanded ? `${accentClasses.bg} rotate-0` : "bg-muted/50 rotate-45"
                      )}>
                        <X className={cn("w-4 h-4", isExpanded ? accentClasses.text : "text-muted-foreground")} />
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mt-2">
                      {component.description}
                    </p>
                  </div>
                </button>

                {/* Expanded content */}
                <div className={cn(
                  "grid transition-all duration-500 ease-in-out",
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="overflow-hidden">
                    <div className="px-6 md:px-8 pb-8 pt-2 border-t border-border/50">
                      {/* Tagline */}
                      <p className={cn("text-sm font-medium mb-6", accentClasses.text)}>
                        {component.details.tagline}
                      </p>

                      {/* Specs grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {component.details.specs.map((spec) => (
                          <div key={spec.label} className={cn("p-4 rounded-xl", accentClasses.bg)}>
                            <spec.icon className={cn("w-5 h-5 mb-2", accentClasses.text)} />
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              {spec.label}
                            </div>
                            <div className="font-semibold text-foreground">
                              {spec.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Features list */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Key Features</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {component.details.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className={cn("w-1.5 h-1.5 rounded-full", accentClasses.bg.replace('/15', ''))} />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status indicators */}
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{component.details.status.active}</span> Active
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{component.details.status.deploying}</span> Deploying
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                          <span className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{component.details.status.planned}</span> Planned
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
