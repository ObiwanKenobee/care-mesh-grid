import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Radio,
  Sun,
  BookOpen,
  Zap,
  MessageCircle,
  RefreshCw,
  Rocket,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useGridNodes, useAlerts, useActivityLogs, useSystemMetrics } from "@/hooks/useGridData";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { DeployTeamDialog } from "@/components/DeployTeamDialog";

const componentIcons = {
  micro_hub: Sun,
  sensing_mesh: Radio,
  compassion_ledger: BookOpen,
  response_swarms: Zap,
  ai_companion: MessageCircle,
};

const componentColors = {
  micro_hub: "text-terracotta",
  sensing_mesh: "text-amber",
  compassion_ledger: "text-forest",
  response_swarms: "text-terracotta",
  ai_companion: "text-amber",
};

const statusColors = {
  active: "bg-green-500",
  processing: "bg-amber-500",
  standby: "bg-blue-500",
  offline: "bg-red-500",
  maintenance: "bg-purple-500",
};

const alertSeverityColors = {
  info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  emergency: "bg-red-700/30 text-red-300 border-red-700/50",
};

const alertStatusIcons = {
  open: AlertTriangle,
  acknowledged: Clock,
  in_progress: RefreshCw,
  resolved: CheckCircle,
};

const Dashboard = () => {
  const { nodes, loading: nodesLoading } = useGridNodes();
  const { alerts, loading: alertsLoading, updateAlertStatus } = useAlerts();
  const { logs, loading: logsLoading } = useActivityLogs();
  const { getLatestMetric } = useSystemMetrics();

  const [selectedTab, setSelectedTab] = useState<"overview" | "alerts" | "nodes" | "activity">("overview");
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<{ id?: string; location?: string } | null>(null);

  const nodesByType = nodes.reduce((acc, node) => {
    acc[node.component_type] = (acc[node.component_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeNodes = nodes.filter((n) => n.status === "active").length;
  const openAlerts = alerts.filter((a) => a.status !== "resolved").length;
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && a.status === "open").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Page header */}
      <div className="sticky top-16 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-forest" />
          <h1 className="font-serif text-xl font-semibold">Control Dashboard</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400 font-medium">LIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="gap-2 bg-terracotta hover:bg-terracotta/90"
            onClick={() => {
              setSelectedAlert(null);
              setDeployDialogOpen(true);
            }}
          >
            <Rocket className="w-4 h-4" />
            Deploy Team
          </Button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border bg-card/50">
        <div className="container px-6">
          <nav className="flex gap-1">
            {(["overview", "alerts", "nodes", "activity"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors border-b-2",
                  selectedTab === tab
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "alerts" && openAlerts > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                    {openAlerts}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="container px-6 py-8">
        {selectedTab === "overview" && (
          <div className="space-y-8">
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-card/50 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-forest/15 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-forest" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total Nodes</span>
                </div>
                <div className="text-3xl font-bold">{nodes.length}</div>
                <div className="text-xs text-green-500 mt-1">{activeNodes} active</div>
              </div>

              <div className="p-6 bg-card/50 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber/15 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber" />
                  </div>
                  <span className="text-sm text-muted-foreground">Open Alerts</span>
                </div>
                <div className="text-3xl font-bold">{openAlerts}</div>
                <div className={cn("text-xs mt-1", criticalAlerts > 0 ? "text-red-500" : "text-muted-foreground")}>
                  {criticalAlerts} critical
                </div>
              </div>

              <div className="p-6 bg-card/50 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-terracotta/15 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-terracotta" />
                  </div>
                  <span className="text-sm text-muted-foreground">Uptime</span>
                </div>
                <div className="text-3xl font-bold">99.7%</div>
                <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
              </div>

              <div className="p-6 bg-card/50 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">AI Sessions</span>
                </div>
                <div className="text-3xl font-bold">342</div>
                <div className="text-xs text-muted-foreground mt-1">Today</div>
              </div>
            </div>

            {/* Component breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-card/50 rounded-xl border border-border">
                <h3 className="font-serif text-lg font-semibold mb-4">Nodes by Component</h3>
                <div className="space-y-3">
                  {Object.entries(nodesByType).map(([type, count]) => {
                    const Icon = componentIcons[type as keyof typeof componentIcons];
                    const colorClass = componentColors[type as keyof typeof componentColors];
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={cn("w-5 h-5", colorClass)} />
                          <span className="text-sm capitalize">{type.replace("_", " ")}</span>
                        </div>
                        <span className="font-mono text-sm">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 bg-card/50 rounded-xl border border-border">
                <h3 className="font-serif text-lg font-semibold mb-4">Recent Alerts</h3>
                <div className="space-y-3">
                  {alerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        alertSeverityColors[alert.severity]
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{alert.title}</div>
                          <div className="text-xs opacity-70">{alert.location}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "alerts" && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold">System Alerts</h2>
            {alertsLoading ? (
              <div className="text-muted-foreground">Loading alerts...</div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const StatusIcon = alertStatusIcons[alert.status];
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-4 rounded-xl border",
                        alertSeverityColors[alert.severity]
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-medium">{alert.title}</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm opacity-80 mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs opacity-60">
                            <span>{alert.location}</span>
                            <span>
                              {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {alert.status === "open" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAlertStatus(alert.id, "acknowledged")}
                              >
                                Acknowledge
                              </Button>
                              <Button
                                size="sm"
                                className="gap-1 bg-terracotta hover:bg-terracotta/90"
                                onClick={() => {
                                  setSelectedAlert({ id: alert.id, location: alert.location || "" });
                                  setDeployDialogOpen(true);
                                }}
                              >
                                <Rocket className="w-3 h-3" />
                                Deploy Team
                              </Button>
                            </>
                          )}
                          {alert.status !== "resolved" && alert.status !== "open" && (
                            <Button
                              size="sm"
                              className="gap-1 bg-terracotta hover:bg-terracotta/90"
                              onClick={() => {
                                setSelectedAlert({ id: alert.id, location: alert.location || "" });
                                setDeployDialogOpen(true);
                              }}
                            >
                              <Rocket className="w-3 h-3" />
                              Deploy Team
                            </Button>
                          )}
                          {alert.status !== "resolved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAlertStatus(alert.id, "resolved")}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {selectedTab === "nodes" && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold">Grid Nodes</h2>
            {nodesLoading ? (
              <div className="text-muted-foreground">Loading nodes...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nodes.map((node) => {
                  const Icon = componentIcons[node.component_type];
                  const colorClass = componentColors[node.component_type];
                  return (
                    <div
                      key={node.id}
                      className="p-4 bg-card/50 rounded-xl border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Icon className={cn("w-5 h-5", colorClass)} />
                          <div>
                            <div className="font-medium">{node.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {node.component_type.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", statusColors[node.status])} />
                          <span className="text-xs text-muted-foreground capitalize">{node.status}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Region: </span>
                          <span>{node.region}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rate: </span>
                          <span>{node.data_rate_gbps} Gbps</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Uptime: </span>
                          <span>{node.uptime_percent}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {selectedTab === "activity" && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold">Activity Log</h2>
            {logsLoading ? (
              <div className="text-muted-foreground">Loading activity...</div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-4 p-3 bg-card/30 rounded-lg border border-border/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-muted-foreground"> - {log.description}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <DeployTeamDialog
        open={deployDialogOpen}
        onOpenChange={setDeployDialogOpen}
        alertId={selectedAlert?.id}
        defaultLocation={selectedAlert?.location || ""}
        defaultPriority={selectedAlert?.id ? "urgent" : "standard"}
      />
    </div>
  );
};

export default Dashboard;
