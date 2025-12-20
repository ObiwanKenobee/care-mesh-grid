import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Sun,
  Radio,
  BookOpen,
  Zap,
  MessageCircle,
  Battery,
  Wifi,
  Users,
  Shield,
  Activity,
  Heart,
  MapPin,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGridNodes } from "@/hooks/useGridData";
import { cn } from "@/lib/utils";

const componentData = {
  "micro-hub": {
    id: "micro_hub",
    title: "Micro-Hub Pods",
    icon: Sun,
    accent: "terracotta",
    tagline: "First-line services: maternal health, nutrition screening, trauma counseling.",
    description: "Small, rugged kiosks staffed by local volunteers with solar power, water filters, cold storage, and edge AI. These are the front-line infrastructure of the Compassion Grid, providing essential services in the most challenging environments.",
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
      "Solar-powered operation",
      "Trauma-informed care protocols",
      "Real-time data sync",
    ],
    stats: { active: 47, deploying: 12, planned: 35 },
  },
  "sensing-mesh": {
    id: "sensing_mesh",
    title: "Social Sensing Mesh",
    icon: Radio,
    accent: "amber",
    tagline: "Edge AI spots spikes in hunger, disease, violence, or displacement.",
    description: "Communities input anonymous distress signals via simple icons on basic phones. The mesh network processes signals locally using edge AI to detect patterns and dispatch mobile response teams automatically.",
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
      "Multi-language support",
      "Crisis trend analysis",
      "Anonymous data collection",
    ],
    stats: { active: 156, deploying: 28, planned: 89 },
  },
  "compassion-ledger": {
    id: "compassion_ledger",
    title: "Compassion Ledger",
    icon: BookOpen,
    accent: "forest",
    tagline: "Eliminating corruption, protecting dignity, and allowing donors to see impact.",
    description: "A lightweight blockchain ledger logs supplies, volunteers, and activities. Every transaction is transparent and verifiable, ensuring aid reaches those who need it without intermediary corruption.",
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
      "Real-time audit trails",
      "Multi-signature approvals",
      "Tamper-proof records",
    ],
    stats: { active: 1, deploying: 0, planned: 2 },
  },
  "response-swarms": {
    id: "response_swarms",
    title: "Mobile Response Swarms",
    icon: Zap,
    accent: "terracotta",
    tagline: "Presence where needed most — inspired by Missionaries of Charity mobility.",
    description: "Trained youth groups carrying rapid kits: nutrition, first aid, telehealth tablets, water testing. They can deploy within 2 hours of an alert and operate with minimal infrastructure support.",
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
      "Mobile telehealth capability",
      "GPS tracking and routing",
      "Supply chain integration",
    ],
    stats: { active: 23, deploying: 8, planned: 45 },
  },
  "ai-companion": {
    id: "ai_companion",
    title: "AI Companion for the Forgotten",
    icon: MessageCircle,
    accent: "amber",
    tagline: "Kindness encoded, not clinical coldness. Presence in isolation.",
    description: "A calm, simple voice interface speaking local languages, offering reassurance, triage, and referral. Designed to provide emotional support and practical guidance to those in crisis situations.",
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
      "Multi-modal interaction",
      "Session continuity",
      "Human handoff capability",
    ],
    stats: { active: 3, deploying: 2, planned: 12 },
  },
};

const accentColors = {
  terracotta: {
    bg: "bg-terracotta/15",
    text: "text-terracotta",
    border: "border-terracotta/30",
  },
  amber: {
    bg: "bg-amber/15",
    text: "text-amber",
    border: "border-amber/30",
  },
  forest: {
    bg: "bg-forest/15",
    text: "text-forest",
    border: "border-forest/30",
  },
};

const ComponentDetail = () => {
  const { componentId } = useParams<{ componentId: string }>();
  const { nodes } = useGridNodes();

  const component = componentId ? componentData[componentId as keyof typeof componentData] : null;

  if (!component) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold mb-4">Component not found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = component.icon;
  const colors = accentColors[component.accent as keyof typeof accentColors];
  const componentNodes = nodes.filter((n) => n.component_type === component.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Icon className={cn("w-5 h-5", colors.text)} />
            <h1 className="font-serif text-xl font-semibold">{component.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">View Dashboard</Button>
          </Link>
          <Link to="/companion">
            <Button variant="outline" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              AI Companion
            </Button>
          </Link>
        </div>
      </header>

      <main className="container px-6 py-12">
        {/* Hero section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-6", colors.bg)}>
            <Icon className={cn("w-10 h-10", colors.text)} />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4">{component.title}</h1>
          <p className={cn("text-xl font-medium mb-4", colors.text)}>{component.tagline}</p>
          <p className="text-lg text-muted-foreground leading-relaxed">{component.description}</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
          <div className="p-6 bg-card/50 rounded-xl border border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-3xl font-bold">{component.stats.active}</span>
            </div>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <div className="p-6 bg-card/50 rounded-xl border border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-3xl font-bold">{component.stats.deploying}</span>
            </div>
            <span className="text-sm text-muted-foreground">Deploying</span>
          </div>
          <div className="p-6 bg-card/50 rounded-xl border border-border text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="text-3xl font-bold">{component.stats.planned}</span>
            </div>
            <span className="text-sm text-muted-foreground">Planned</span>
          </div>
        </div>

        {/* Specs and features */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Specifications */}
          <div className="p-6 bg-card/50 rounded-xl border border-border">
            <h3 className="font-serif text-xl font-semibold mb-6">Specifications</h3>
            <div className="space-y-4">
              {component.specs.map((spec) => (
                <div key={spec.label} className={cn("p-4 rounded-lg", colors.bg)}>
                  <spec.icon className={cn("w-5 h-5 mb-2", colors.text)} />
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {spec.label}
                  </div>
                  <div className="font-semibold">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="p-6 bg-card/50 rounded-xl border border-border">
            <h3 className="font-serif text-xl font-semibold mb-6">Key Features</h3>
            <div className="grid grid-cols-1 gap-3">
              {component.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", colors.bg.replace("/15", ""))} />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live nodes */}
        {componentNodes.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h3 className="font-serif text-xl font-semibold mb-6">Live Nodes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {componentNodes.map((node) => (
                <div
                  key={node.id}
                  className="p-4 bg-card/50 rounded-xl border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium">{node.name}</div>
                      <div className="text-sm text-muted-foreground">{node.region}</div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        node.status === "active"
                          ? "bg-green-500/10 text-green-500 border-green-500/30"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                      )}
                    >
                      {node.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Rate: {node.data_rate_gbps} Gbps</div>
                    <div>Uptime: {node.uptime_percent}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ComponentDetail;
