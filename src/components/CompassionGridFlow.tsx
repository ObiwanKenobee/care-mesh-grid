import { useEffect, useRef, useState } from "react";
import {
  Wifi,
  Brain,
  Database,
  Truck,
  MessageCircle,
  Activity,
} from "lucide-react";

interface GridNode {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  x: number;
  y: number;
  status: "active" | "processing" | "standby";
  dataRate: string;
}

interface Connection {
  from: string;
  to: string;
  label: string;
  particles: number;
}

const gridNodes: GridNode[] = [
  {
    id: "micro-hub",
    name: "Micro-Hub Pods",
    icon: <Wifi className="w-6 h-6" />,
    color: "hsl(180, 100%, 50%)",
    x: 15,
    y: 30,
    status: "active",
    dataRate: "2.4 TB/s",
  },
  {
    id: "sensing-mesh",
    name: "Social Sensing Mesh",
    icon: <Brain className="w-6 h-6" />,
    color: "hsl(270, 80%, 60%)",
    x: 50,
    y: 15,
    status: "processing",
    dataRate: "847 GB/s",
  },
  {
    id: "compassion-ledger",
    name: "Compassion Ledger",
    icon: <Database className="w-6 h-6" />,
    color: "hsl(150, 70%, 50%)",
    x: 85,
    y: 30,
    status: "active",
    dataRate: "1.2 TB/s",
  },
  {
    id: "response-swarms",
    name: "Mobile Response Swarms",
    icon: <Truck className="w-6 h-6" />,
    color: "hsl(45, 100%, 55%)",
    x: 25,
    y: 75,
    status: "active",
    dataRate: "324 GB/s",
  },
  {
    id: "ai-companion",
    name: "AI Companion",
    icon: <MessageCircle className="w-6 h-6" />,
    color: "hsl(350, 80%, 60%)",
    x: 75,
    y: 75,
    status: "processing",
    dataRate: "1.8 TB/s",
  },
];

const connections: Connection[] = [
  { from: "micro-hub", to: "sensing-mesh", label: "Environmental Data", particles: 5 },
  { from: "sensing-mesh", to: "compassion-ledger", label: "Analyzed Patterns", particles: 4 },
  { from: "compassion-ledger", to: "ai-companion", label: "Action Directives", particles: 6 },
  { from: "ai-companion", to: "response-swarms", label: "Deployment Orders", particles: 5 },
  { from: "response-swarms", to: "micro-hub", label: "Field Updates", particles: 4 },
  { from: "sensing-mesh", to: "response-swarms", label: "Priority Alerts", particles: 3 },
  { from: "compassion-ledger", to: "micro-hub", label: "Resource Allocation", particles: 3 },
];

const AnimatedConnection = ({
  from,
  to,
  label,
  particles,
  nodes,
  index,
}: {
  from: string;
  to: string;
  label: string;
  particles: number;
  nodes: GridNode[];
  index: number;
}) => {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);

  if (!fromNode || !toNode) return null;

  const pathId = `path-${from}-${to}`;
  
  // Calculate control point for curved line
  const midX = (fromNode.x + toNode.x) / 2;
  const midY = (fromNode.y + toNode.y) / 2;
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const curvature = 15;
  const controlX = midX - (dy / 10) * curvature / 10;
  const controlY = midY + (dx / 10) * curvature / 10;

  return (
    <g>
      {/* Glow effect path */}
      <path
        d={`M ${fromNode.x} ${fromNode.y} Q ${controlX} ${controlY} ${toNode.x} ${toNode.y}`}
        fill="none"
        stroke={fromNode.color}
        strokeWidth="4"
        strokeOpacity="0.15"
        className="animate-pulse-glow"
        style={{ animationDelay: `${index * 0.3}s` }}
      />
      
      {/* Base path */}
      <path
        id={pathId}
        d={`M ${fromNode.x} ${fromNode.y} Q ${controlX} ${controlY} ${toNode.x} ${toNode.y}`}
        fill="none"
        stroke="hsl(220, 15%, 25%)"
        strokeWidth="2"
        strokeOpacity="0.5"
      />
      
      {/* Animated dashed overlay */}
      <path
        d={`M ${fromNode.x} ${fromNode.y} Q ${controlX} ${controlY} ${toNode.x} ${toNode.y}`}
        fill="none"
        stroke={fromNode.color}
        strokeWidth="2"
        strokeDasharray="8 12"
        strokeLinecap="round"
        className="animate-data-flow"
        style={{ 
          animationDelay: `${index * 0.2}s`,
          animationDuration: `${2 + index * 0.3}s`
        }}
      />

      {/* Flowing particles */}
      {Array.from({ length: particles }).map((_, i) => (
        <circle
          key={i}
          r="3"
          fill={fromNode.color}
          filter="url(#glow)"
        >
          <animateMotion
            dur={`${2 + i * 0.5}s`}
            repeatCount="indefinite"
            begin={`${i * 0.4}s`}
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur={`${2 + i * 0.5}s`}
            repeatCount="indefinite"
            begin={`${i * 0.4}s`}
          />
          <animate
            attributeName="r"
            values="2;4;2"
            dur={`${2 + i * 0.5}s`}
            repeatCount="indefinite"
            begin={`${i * 0.4}s`}
          />
        </circle>
      ))}

      {/* Connection label */}
      <text
        x={controlX}
        y={controlY - 3}
        textAnchor="middle"
        fill="hsl(215, 20%, 55%)"
        fontSize="2.5"
        fontWeight="500"
        className="pointer-events-none"
      >
        {label}
      </text>
    </g>
  );
};

const GridNodeComponent = ({ node, index }: { node: GridNode; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer"
    >
      {/* Outer glow ring */}
      <circle
        r={isHovered ? 10 : 8}
        fill="none"
        stroke={node.color}
        strokeWidth="1"
        strokeOpacity={isHovered ? 0.6 : 0.3}
        className="transition-all duration-300"
      >
        <animate
          attributeName="r"
          values="7;9;7"
          dur="2s"
          repeatCount="indefinite"
          begin={`${index * 0.3}s`}
        />
        <animate
          attributeName="stroke-opacity"
          values="0.2;0.5;0.2"
          dur="2s"
          repeatCount="indefinite"
          begin={`${index * 0.3}s`}
        />
      </circle>

      {/* Pulsing background glow */}
      <circle
        r="6"
        fill={node.color}
        fillOpacity="0.15"
        filter="url(#glow)"
      >
        <animate
          attributeName="r"
          values="5;7;5"
          dur="3s"
          repeatCount="indefinite"
          begin={`${index * 0.5}s`}
        />
      </circle>

      {/* Main node circle */}
      <circle
        r="5"
        fill="hsl(220, 18%, 12%)"
        stroke={node.color}
        strokeWidth="1.5"
        className="transition-all duration-300"
        style={{
          filter: isHovered ? `drop-shadow(0 0 8px ${node.color})` : "none",
        }}
      />

      {/* Status indicator */}
      <circle
        cx="3.5"
        cy="-3.5"
        r="1.2"
        fill={
          node.status === "active"
            ? "hsl(150, 70%, 50%)"
            : node.status === "processing"
            ? "hsl(45, 100%, 55%)"
            : "hsl(215, 20%, 50%)"
        }
      >
        {node.status === "processing" && (
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Icon placeholder (represented as inner circle) */}
      <circle r="2.5" fill={node.color} fillOpacity="0.8" />

      {/* Node name */}
      <text
        y="11"
        textAnchor="middle"
        fill="hsl(210, 40%, 92%)"
        fontSize="2.8"
        fontWeight="600"
      >
        {node.name}
      </text>

      {/* Data rate */}
      <text
        y="14.5"
        textAnchor="middle"
        fill={node.color}
        fontSize="2"
        fontWeight="500"
      >
        {node.dataRate}
      </text>

      {/* Hover tooltip */}
      {isHovered && (
        <g>
          <rect
            x="-12"
            y="-20"
            width="24"
            height="8"
            rx="1"
            fill="hsl(220, 18%, 15%)"
            stroke={node.color}
            strokeWidth="0.3"
          />
          <text
            y="-14.5"
            textAnchor="middle"
            fill="hsl(210, 40%, 92%)"
            fontSize="2"
          >
            Status: {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
          </text>
        </g>
      )}
    </g>
  );
};

export const CompassionGridFlow = () => {
  const [activeConnections, setActiveConnections] = useState(connections.length);
  const [totalDataFlow, setTotalDataFlow] = useState(0);

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setTotalDataFlow((prev) => prev + Math.random() * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Compassion Grid
            </h1>
          </div>
          <p className="text-muted-foreground">
            Real-time infrastructure data flow visualization
          </p>
        </div>
      </header>

      {/* Stats bar */}
      <div className="relative z-10 px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-6 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                {gridNodes.filter((n) => n.status === "active").length} Active Nodes
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                {gridNodes.filter((n) => n.status === "processing").length} Processing
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {activeConnections} Active Connections
              </span>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-primary font-mono">
                {totalDataFlow.toFixed(1)} TB transferred
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main visualization */}
      <div className="relative z-10 px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-[16/9] bg-card/30 backdrop-blur-sm rounded-xl border border-border overflow-hidden">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Definitions for effects */}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Animated connections */}
              {connections.map((conn, index) => (
                <AnimatedConnection
                  key={`${conn.from}-${conn.to}`}
                  {...conn}
                  nodes={gridNodes}
                  index={index}
                />
              ))}

              {/* Grid nodes */}
              {gridNodes.map((node, index) => (
                <GridNodeComponent key={node.id} node={node} index={index} />
              ))}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 p-3 bg-card/80 backdrop-blur-sm rounded-lg border border-border">
              <h4 className="text-xs font-semibold text-foreground mb-2">Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-muted-foreground">Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                  <span className="text-xs text-muted-foreground">Data Flow</span>
                </div>
              </div>
            </div>

            {/* Real-time indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-card/80 backdrop-blur-sm rounded-full border border-border">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Component cards */}
      <div className="relative z-10 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {gridNodes.map((node, index) => (
              <div
                key={node.id}
                className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border hover:border-primary/50 transition-all duration-300 group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${node.color}20` }}
                >
                  <div style={{ color: node.color }}>{node.icon}</div>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {node.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Data Rate: {node.dataRate}
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      node.status === "active"
                        ? "bg-green-500"
                        : node.status === "processing"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-gray-500"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
