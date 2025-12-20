import { useState, useEffect, useRef } from "react";
import { Sun, Radio, BookOpen, Zap, MessageCircle, X, Battery, Wifi, Users, Heart, Shield, Activity, Database, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

// Data flow connections between components with visual positions
const dataFlows = [
  { from: 1, to: 0, label: "Distress signals trigger hub response" },
  { from: 0, to: 2, label: "Activities logged to ledger" },
  { from: 2, to: 3, label: "Verified alerts dispatch teams" },
  { from: 3, to: 4, label: "Field data feeds AI learning" },
  { from: 4, to: 1, label: "AI enhances signal detection" },
];

const systemMetrics = {
  totalNodes: 230,
  activeConnections: 1847,
  dataProcessed: "2.4TB",
  uptime: "99.7%",
  latency: "< 200ms",
};

// Node colors for the flow diagram
const nodeColors = {
  terracotta: { stroke: "hsl(16, 65%, 55%)", fill: "hsl(16, 65%, 55%)" },
  amber: { stroke: "hsl(38, 92%, 50%)", fill: "hsl(38, 92%, 50%)" },
  forest: { stroke: "hsl(160, 35%, 35%)", fill: "hsl(160, 35%, 35%)" },
};

// Animated connection component
const AnimatedConnection = ({
  x1,
  y1,
  x2,
  y2,
  color,
  delay = 0,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  delay?: number;
  label: string;
}) => {
  const pathId = `path-${x1}-${y1}-${x2}-${y2}`;
  
  // Calculate control point for curved line
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const curvature = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;
  const controlX = midX - (dy > 0 ? curvature : -curvature) * 0.5;
  const controlY = midY + (dx > 0 ? curvature : -curvature) * 0.5;

  const pathD = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;

  return (
    <g>
      {/* Glow effect */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeOpacity="0.1"
        className="animate-pulse-line"
        style={{ animationDelay: `${delay}s` }}
      />
      
      {/* Base path */}
      <path
        id={pathId}
        d={pathD}
        fill="none"
        stroke="hsl(30, 15%, 25%)"
        strokeWidth="2"
        strokeOpacity="0.4"
      />
      
      {/* Animated dashed line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="8 16"
        strokeLinecap="round"
        className="animate-data-flow"
        style={{ 
          animationDelay: `${delay}s`,
          animationDuration: `${1.5 + delay * 0.2}s`
        }}
      />

      {/* Flowing particles */}
      {[0, 1, 2].map((i) => (
        <circle key={i} r="4" fill={color} filter="url(#glow)">
          <animateMotion
            dur={`${2.5 + i * 0.3}s`}
            repeatCount="indefinite"
            begin={`${delay + i * 0.8}s`}
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur={`${2.5 + i * 0.3}s`}
            repeatCount="indefinite"
            begin={`${delay + i * 0.8}s`}
          />
          <animate
            attributeName="r"
            values="3;5;3"
            dur={`${2.5 + i * 0.3}s`}
            repeatCount="indefinite"
            begin={`${delay + i * 0.8}s`}
          />
        </circle>
      ))}
    </g>
  );
};

// Flow diagram node
const FlowNode = ({
  x,
  y,
  icon: Icon,
  color,
  label,
  index,
}: {
  x: number;
  y: number;
  icon: React.ElementType;
  color: { stroke: string; fill: string };
  label: string;
  index: number;
}) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Pulsing outer ring */}
      <circle r="32" fill="none" stroke={color.stroke} strokeWidth="1" strokeOpacity="0.3">
        <animate
          attributeName="r"
          values="28;34;28"
          dur="3s"
          repeatCount="indefinite"
          begin={`${index * 0.4}s`}
        />
        <animate
          attributeName="stroke-opacity"
          values="0.2;0.5;0.2"
          dur="3s"
          repeatCount="indefinite"
          begin={`${index * 0.4}s`}
        />
      </circle>
      
      {/* Background glow */}
      <circle r="24" fill={color.fill} fillOpacity="0.15" filter="url(#glow)">
        <animate
          attributeName="r"
          values="22;26;22"
          dur="4s"
          repeatCount="indefinite"
          begin={`${index * 0.5}s`}
        />
      </circle>
      
      {/* Main circle */}
      <circle
        r="22"
        fill="hsl(30, 20%, 10%)"
        stroke={color.stroke}
        strokeWidth="2"
      />
      
      {/* Inner icon circle */}
      <circle r="12" fill={color.fill} fillOpacity="0.25" />
      
      {/* Status indicator */}
      <circle cx="16" cy="-16" r="5" fill="hsl(150, 70%, 45%)">
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Label */}
      <text
        y="45"
        textAnchor="middle"
        fill="hsl(35, 30%, 92%)"
        fontSize="11"
        fontWeight="600"
        fontFamily="'Source Serif 4', Georgia, serif"
      >
        {label}
      </text>
    </g>
  );
};

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

// Node positions for the pentagon layout
const getNodePositions = (centerX: number, centerY: number, radius: number) => {
  return components.map((_, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2; // Start from top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
};

const HowItWorks = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [dataTransferred, setDataTransferred] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Simulate live data transfer
  useEffect(() => {
    const interval = setInterval(() => {
      setDataTransferred((prev) => prev + Math.random() * 50);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // SVG dimensions and node positions
  const svgWidth = 600;
  const svgHeight = 400;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2 - 20;
  const radius = 140;
  const nodePositions = getNodePositions(centerX, centerY, radius);

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
        
        {/* System Overview Grid */}
        <div className="mb-16 p-6 md:p-8 bg-card/40 backdrop-blur-sm border border-border rounded-3xl">
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest/15 flex items-center justify-center">
                <Globe className="w-5 h-5 text-forest" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">Compassion Grid Overview</h3>
                <p className="text-sm text-muted-foreground">Real-time system status</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 font-medium">LIVE</span>
            </div>
          </div>
          
          {/* Metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="p-4 bg-background/50 rounded-xl border border-border/50">
              <div className="text-2xl font-bold text-terracotta">{systemMetrics.totalNodes}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Nodes</div>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-border/50">
              <div className="text-2xl font-bold text-amber">{systemMetrics.activeConnections}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Active Links</div>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-border/50">
              <div className="text-2xl font-bold text-forest">{systemMetrics.dataProcessed}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Data Processed</div>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-border/50">
              <div className="text-2xl font-bold text-green-500">{systemMetrics.uptime}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Uptime</div>
            </div>
            <div className="p-4 bg-background/50 rounded-xl border border-border/50 col-span-2 md:col-span-1">
              <div className="text-2xl font-bold text-foreground">{dataTransferred.toFixed(1)} GB</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Transferred</div>
            </div>
          </div>

          {/* Animated flow diagram */}
          <div className="relative">
            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              Data Flow Architecture
            </h4>
            
            {/* SVG Flow Diagram */}
            <div className="w-full overflow-hidden rounded-2xl bg-background/30 border border-border/50 p-4">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto max-h-[400px]"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Definitions for effects */}
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  
                  <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(16, 65%, 55%)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="hsl(16, 65%, 55%)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Background grid */}
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(30, 15%, 20%)" strokeWidth="0.5" strokeOpacity="0.3" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Animated connections */}
                {dataFlows.map((flow, idx) => {
                  const fromPos = nodePositions[flow.from];
                  const toPos = nodePositions[flow.to];
                  const fromComponent = components[flow.from];
                  const color = nodeColors[fromComponent.accent as keyof typeof nodeColors];
                  
                  return (
                    <AnimatedConnection
                      key={`${flow.from}-${flow.to}`}
                      x1={fromPos.x}
                      y1={fromPos.y}
                      x2={toPos.x}
                      y2={toPos.y}
                      color={color.stroke}
                      delay={idx * 0.3}
                      label={flow.label}
                    />
                  );
                })}

                {/* Nodes */}
                {components.map((comp, idx) => {
                  const pos = nodePositions[idx];
                  const color = nodeColors[comp.accent as keyof typeof nodeColors];
                  
                  return (
                    <FlowNode
                      key={comp.title}
                      x={pos.x}
                      y={pos.y}
                      icon={comp.icon}
                      color={color}
                      label={comp.title.split(' ')[0]}
                      index={idx}
                    />
                  );
                })}

                {/* Center hub indicator */}
                <circle cx={centerX} cy={centerY} r="8" fill="hsl(160, 35%, 35%)" fillOpacity="0.3">
                  <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={centerX} cy={centerY} r="4" fill="hsl(160, 35%, 45%)" />
              </svg>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-border/30">
                {dataFlows.map((flow, idx) => (
                  <span key={idx} className="text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                    {flow.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
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
