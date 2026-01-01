import { useState } from "react";
import {
  MapPin,
  Activity,
  Rocket,
  Bell,
  BellOff,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamTrackingMap from "@/components/TeamTrackingMap";
import { DeployTeamDialog } from "@/components/DeployTeamDialog";
import { MissionCompletionDialog } from "@/components/MissionCompletionDialog";
import { useActivityLogs } from "@/hooks/useGridData";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { formatDistanceToNow } from "date-fns";

const Tracking = () => {
  const { logs } = useActivityLogs();
  const { permission, isSupported, requestPermission } = usePushNotifications();
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<{
    id: string;
    type: string;
    location: string;
    teams: number;
  } | null>(null);

  // Filter deployment logs
  const deploymentLogs = logs.filter(
    (log) =>
      log.action === "RESPONSE_TEAM_DEPLOYED" ||
      log.action === "PAYMENT_COMPLETED"
  );

  const handleCompleteMission = (log: typeof logs[0]) => {
    const metadata = log.metadata as Record<string, unknown>;
    setSelectedMission({
      id: metadata?.deployment_id as string || log.id,
      type: metadata?.mission_type as string || "multi-purpose",
      location: metadata?.location as string || "Unknown",
      teams: metadata?.team_size as number || 1,
    });
    setCompletionDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Page header */}
      <div className="sticky top-16 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-terracotta" />
          <h1 className="font-serif text-xl font-semibold">Team Tracking</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications toggle */}
          {isSupported && (
            <Button
              variant="outline"
              size="sm"
              onClick={requestPermission}
              className="gap-2"
              disabled={permission === "granted"}
            >
              {permission === "granted" ? (
                <>
                  <Bell className="w-4 h-4 text-green-500" />
                  Notifications On
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4" />
                  Enable Notifications
                </>
              )}
            </Button>
          )}

          <Button
            size="sm"
            className="gap-2 bg-terracotta hover:bg-terracotta/90"
            onClick={() => setDeployDialogOpen(true)}
          >
            <Rocket className="w-4 h-4" />
            Deploy Team
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Map */}
        <div className="flex-1 relative">
          <TeamTrackingMap className="h-[50vh] lg:h-full w-full" />
        </div>

        {/* Deployment Activity Panel */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card/50 overflow-auto">
          <div className="p-4 border-b border-border">
            <h2 className="font-serif text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-forest" />
              Deployment Activity
            </h2>
          </div>

          <div className="p-4 space-y-3">
            {deploymentLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No deployments yet</p>
                <p className="text-xs mt-1">Deploy a team to see activity here</p>
              </div>
            ) : (
              deploymentLogs.map((log) => {
                const metadata = log.metadata as Record<string, unknown>;
                const isDeployment = log.action === "RESPONSE_TEAM_DEPLOYED";
                
                return (
                  <div
                    key={log.id}
                    className="p-3 bg-card rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {isDeployment ? (
                          <Rocket className="w-4 h-4 text-terracotta" />
                        ) : (
                          <span className="text-green-500">💰</span>
                        )}
                        <span className="font-medium text-sm">
                          {isDeployment ? "Team Deployed" : "Payment Received"}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {metadata?.priority as string || "standard"}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {log.description}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </span>
                      
                      {isDeployment && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => handleCompleteMission(log)}
                        >
                          Complete Mission
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <DeployTeamDialog
        open={deployDialogOpen}
        onOpenChange={setDeployDialogOpen}
      />

      {selectedMission && (
        <MissionCompletionDialog
          open={completionDialogOpen}
          onOpenChange={setCompletionDialogOpen}
          missionId={selectedMission.id}
          missionType={selectedMission.type}
          location={selectedMission.location}
          teamsDeployed={selectedMission.teams}
        />
      )}
    </div>
  );
};

export default Tracking;
