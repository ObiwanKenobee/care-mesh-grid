import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  Radio,
  BookOpen,
  Zap,
  MessageCircle,
  ArrowLeft,
  Activity,
  Globe,
  Pause,
  Play,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings2,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Node colors
const nodeColors = {
  terracotta: { stroke: "hsl(16, 65%, 55%)", fill: "hsl(16, 65%, 55%)" },
  amber: { stroke: "hsl(38, 92%, 50%)", fill: "hsl(38, 92%, 50%)" },
  forest: { stroke: "hsl(160, 35%, 35%)", fill: "hsl(160, 35%, 35%)" },
};

// Grid components data
const gridComponents = [
  {
    id: "micro-hub",
    icon: Sun,
    title: "Micro-Hub Pods",
    shortTitle: "Micro-Hub",
    accent: "terracotta",
    status: "active",
    dataRate: "2.4 TB/s",
    activeNodes: 47,
    description: "Solar-powered kiosks with edge AI, water filters, and cold storage.",
  },
  {
    id: "sensing-mesh",
    icon: Radio,
    title: "Social Sensing Mesh",
    shortTitle: "Sensing",
    accent: "amber",
    status: "processing",
    dataRate: "847 GB/s",
    activeNodes: 156,
    description: "Anonymous distress signal collection via basic phones.",
  },
  {
    id: "compassion-ledger",
    icon: BookOpen,
    title: "Compassion Ledger",
    shortTitle: "Ledger",
    accent: "forest",
    status: "active",
    dataRate: "1.2 TB/s",
    activeNodes: 1,
    description: "Blockchain for transparent supply and volunteer tracking.",
  },
  {
    id: "response-swarms",
    icon: Zap,
    title: "Mobile Response Swarms",
    shortTitle: "Swarms",
    accent: "terracotta",
    status: "active",
    dataRate: "324 GB/s",
    activeNodes: 23,
    description: "Rapid deployment teams with nutrition and first aid kits.",
  },
  {
    id: "ai-companion",
    icon: MessageCircle,
    title: "AI Companion",
    shortTitle: "AI",
    accent: "amber",
    status: "processing",
    dataRate: "1.8 TB/s",
    activeNodes: 3,
    description: "Voice interface in 47 local dialects for crisis support.",
  },
];

// Data flows between components
const dataFlows = [
  { from: 1, to: 0, label: "Distress signals" },
  { from: 0, to: 2, label: "Activity logs" },
  { from: 2, to: 3, label: "Dispatch orders" },
  { from: 3, to: 4, label: "Field data" },
  { from: 4, to: 1, label: "AI insights" },
  { from: 2, to: 4, label: "Verification" },
  { from: 0, to: 4, label: "Diagnostics" },
];

// Get pentagon node positions
const getNodePositions = (centerX: number, centerY: number, radius: number) => {
  return gridComponents.map((_, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
};

// Animated connection component
const AnimatedConnection = ({
  x1,
  y1,
  x2,
  y2,
  color,
  delay = 0,
  speed = 1,
  particleCount = 3,
  isActive = true,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  delay?: number;
  speed?: number;
  particleCount?: number;
  isActive?: boolean;
}) => {
  const pathId = `path-${x1.toFixed(0)}-${y1.toFixed(0)}-${x2.toFixed(0)}-${y2.toFixed(0)}`;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const curvature = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3;
  const controlX = midX - (dy > 0 ? curvature : -curvature) * 0.5;
  const controlY = midY + (dx > 0 ? curvature : -curvature) * 0.5;

  const pathD = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
  const baseDuration = 2.5 / speed;

  return (
    <g className={cn(!isActive && "opacity-30")}>
      {/* Glow effect */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeOpacity="0.08"
        className={isActive ? "animate-pulse-line" : ""}
        style={{ animationDelay: `${delay}s` }}
      />

      {/* Base path */}
      <path
        id={pathId}
        d={pathD}
        fill="none"
        stroke="hsl(30, 15%, 20%)"
        strokeWidth="2"
        strokeOpacity="0.5"
      />

      {/* Animated dashed line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="6 12"
        strokeLinecap="round"
        className={isActive ? "animate-data-flow" : ""}
        style={{
          animationDelay: `${delay}s`,
          animationDuration: `${1.5 / speed}s`,
        }}
      />

      {/* Flowing particles */}
      {isActive &&
        Array.from({ length: particleCount }).map((_, i) => (
          <circle key={i} r="5" fill={color} filter="url(#glow)">
            <animateMotion
              dur={`${baseDuration + i * 0.3}s`}
              repeatCount="indefinite"
              begin={`${delay + i * 0.6}s`}
            >
              <mpath href={`#${pathId}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur={`${baseDuration + i * 0.3}s`}
              repeatCount="indefinite"
              begin={`${delay + i * 0.6}s`}
            />
            <animate
              attributeName="r"
              values="3;6;3"
              dur={`${baseDuration + i * 0.3}s`}
              repeatCount="indefinite"
              begin={`${delay + i * 0.6}s`}
            />
          </circle>
        ))}
    </g>
  );
};

// Interactive grid node
const GridNode = ({
  x,
  y,
  component,
  index,
  isSelected,
  onSelect,
  scale = 1,
}: {
  x: number;
  y: number;
  component: (typeof gridComponents)[0];
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  scale?: number;
}) => {
  const Icon = component.icon;
  const color = nodeColors[component.accent as keyof typeof nodeColors];
  const nodeRadius = 28 * scale;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onSelect}
      className="cursor-pointer"
    >
      {/* Selection ring */}
      {isSelected && (
        <circle
          r={nodeRadius + 12}
          fill="none"
          stroke={color.stroke}
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-spin"
          style={{ animationDuration: "8s" }}
        />
      )}

      {/* Pulsing outer ring */}
      <circle
        r={nodeRadius + 6}
        fill="none"
        stroke={color.stroke}
        strokeWidth="1"
        strokeOpacity="0.3"
      >
        <animate
          attributeName="r"
          values={`${nodeRadius + 4};${nodeRadius + 10};${nodeRadius + 4}`}
          dur="3s"
          repeatCount="indefinite"
          begin={`${index * 0.4}s`}
        />
        <animate
          attributeName="stroke-opacity"
          values="0.2;0.6;0.2"
          dur="3s"
          repeatCount="indefinite"
          begin={`${index * 0.4}s`}
        />
      </circle>

      {/* Background glow */}
      <circle
        r={nodeRadius}
        fill={color.fill}
        fillOpacity="0.15"
        filter="url(#glow)"
      >
        <animate
          attributeName="r"
          values={`${nodeRadius - 2};${nodeRadius + 4};${nodeRadius - 2}`}
          dur="4s"
          repeatCount="indefinite"
          begin={`${index * 0.5}s`}
        />
      </circle>

      {/* Main circle */}
      <circle
        r={nodeRadius}
        fill="hsl(30, 20%, 8%)"
        stroke={color.stroke}
        strokeWidth={isSelected ? "3" : "2"}
        className="transition-all duration-300"
      />

      {/* Inner icon area */}
      <circle r={nodeRadius * 0.5} fill={color.fill} fillOpacity="0.3" />

      {/* Status indicator */}
      <circle
        cx={nodeRadius * 0.65}
        cy={-nodeRadius * 0.65}
        r="6"
        fill={component.status === "active" ? "hsl(150, 70%, 45%)" : "hsl(38, 92%, 50%)"}
      >
        {component.status === "processing" && (
          <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
        )}
      </circle>

      {/* Label */}
      <text
        y={nodeRadius + 18}
        textAnchor="middle"
        fill="hsl(35, 30%, 92%)"
        fontSize="13"
        fontWeight="600"
        fontFamily="'Source Serif 4', Georgia, serif"
      >
        {component.shortTitle}
      </text>

      {/* Data rate */}
      <text
        y={nodeRadius + 32}
        textAnchor="middle"
        fill={color.fill}
        fontSize="10"
        fontWeight="500"
      >
        {component.dataRate}
      </text>
    </g>
  );
};

const Grid = () => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [dataTransferred, setDataTransferred] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate live data transfer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setDataTransferred((prev) => prev + Math.random() * 100 * speed);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 600;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = 180 * zoom;
  const nodePositions = getNodePositions(centerX, centerY, radius);

  const selectedComponent = selectedNode !== null ? gridComponents[selectedNode] : null;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-forest" />
            <h1 className="font-serif text-xl font-semibold">Compassion Grid</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
            <div className={cn("w-2 h-2 rounded-full bg-red-500", isPlaying && "animate-pulse")} />
            <span className="text-xs text-red-400 font-medium">{isPlaying ? "LIVE" : "PAUSED"}</span>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="text-muted-foreground">
              Transferred: <span className="text-foreground font-mono">{dataTransferred.toFixed(1)} GB</span>
            </div>
            <div className="text-muted-foreground">
              Nodes: <span className="text-forest font-mono">230</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowControls(!showControls)}
            className="gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Controls
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main visualization */}
        <div className="flex-1 relative overflow-hidden">
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(hsl(30, 15%, 18%) 1px, transparent 1px),
                linear-gradient(90deg, hsl(30, 15%, 18%) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* SVG visualization */}
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(160, 35%, 35%)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(160, 35%, 35%)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Center glow */}
            <circle cx={centerX} cy={centerY} r="80" fill="url(#centerGlow)" />

            {/* Animated connections */}
            {dataFlows.map((flow, idx) => {
              const fromPos = nodePositions[flow.from];
              const toPos = nodePositions[flow.to];
              const fromComponent = gridComponents[flow.from];
              const color = nodeColors[fromComponent.accent as keyof typeof nodeColors];

              return (
                <AnimatedConnection
                  key={`${flow.from}-${flow.to}`}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  color={color.stroke}
                  delay={idx * 0.25}
                  speed={speed}
                  particleCount={4}
                  isActive={isPlaying}
                />
              );
            })}

            {/* Grid nodes */}
            {gridComponents.map((comp, idx) => {
              const pos = nodePositions[idx];
              return (
                <GridNode
                  key={comp.id}
                  x={pos.x}
                  y={pos.y}
                  component={comp}
                  index={idx}
                  isSelected={selectedNode === idx}
                  onSelect={() => setSelectedNode(selectedNode === idx ? null : idx)}
                  scale={zoom}
                />
              );
            })}

            {/* Center hub */}
            <circle cx={centerX} cy={centerY} r="12" fill="hsl(160, 35%, 35%)" fillOpacity="0.3">
              <animate attributeName="r" values="10;16;10" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx={centerX} cy={centerY} r="6" fill="hsl(160, 35%, 45%)" />
            <text
              x={centerX}
              y={centerY + 30}
              textAnchor="middle"
              fill="hsl(35, 30%, 70%)"
              fontSize="11"
            >
              Core
            </text>
          </svg>

          {/* Fullscreen button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Side panel */}
        {showControls && (
          <div className="w-80 border-l border-border bg-card/30 backdrop-blur-sm p-6 overflow-y-auto">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  Simulation Controls
                </h3>

                {/* Play/Pause */}
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant={isPlaying ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDataTransferred(0);
                      setSelectedNode(null);
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>

                {/* Speed control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Speed</span>
                    <span className="font-mono text-foreground">{speed.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[speed]}
                    onValueChange={([v]) => setSpeed(v)}
                    min={0.25}
                    max={3}
                    step={0.25}
                    className="w-full"
                  />
                </div>

                {/* Zoom control */}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Zoom</span>
                    <span className="font-mono text-foreground">{(zoom * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Slider
                      value={[zoom]}
                      onValueChange={([v]) => setZoom(v)}
                      min={0.5}
                      max={1.5}
                      step={0.1}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Selected node details */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  {selectedComponent ? "Selected Component" : "Select a Node"}
                </h3>

                {selectedComponent ? (
                  <div className="space-y-4">
                    <div
                      className={cn(
                        "p-4 rounded-xl border",
                        selectedComponent.accent === "terracotta"
                          ? "bg-terracotta/10 border-terracotta/30"
                          : selectedComponent.accent === "amber"
                          ? "bg-amber/10 border-amber/30"
                          : "bg-forest/10 border-forest/30"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <selectedComponent.icon
                          className={cn(
                            "w-6 h-6",
                            selectedComponent.accent === "terracotta"
                              ? "text-terracotta"
                              : selectedComponent.accent === "amber"
                              ? "text-amber"
                              : "text-forest"
                          )}
                        />
                        <div>
                          <h4 className="font-serif font-semibold">{selectedComponent.title}</h4>
                          <div className="flex items-center gap-2 text-xs">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                selectedComponent.status === "active" ? "bg-green-500" : "bg-amber-500"
                              )}
                            />
                            <span className="text-muted-foreground capitalize">
                              {selectedComponent.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedComponent.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-foreground">
                          {selectedComponent.activeNodes}
                        </div>
                        <div className="text-xs text-muted-foreground">Active Nodes</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-foreground">
                          {selectedComponent.dataRate}
                        </div>
                        <div className="text-xs text-muted-foreground">Data Rate</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click on any node in the visualization to view its details and statistics.
                  </p>
                )}
              </div>

              <div className="h-px bg-border" />

              {/* All components list */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">All Components</h3>
                <div className="space-y-2">
                  {gridComponents.map((comp, idx) => (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedNode(selectedNode === idx ? null : idx)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                        selectedNode === idx
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/20 hover:bg-muted/40 border border-transparent"
                      )}
                    >
                      <comp.icon
                        className={cn(
                          "w-5 h-5",
                          comp.accent === "terracotta"
                            ? "text-terracotta"
                            : comp.accent === "amber"
                            ? "text-amber"
                            : "text-forest"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{comp.title}</div>
                        <div className="text-xs text-muted-foreground">{comp.dataRate}</div>
                      </div>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          comp.status === "active" ? "bg-green-500" : "bg-amber-500 animate-pulse"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grid;
