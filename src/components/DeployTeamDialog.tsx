import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDeployTeam } from "@/hooks/useDeployTeam";
import { Zap, MapPin, Users, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeployTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertId?: string;
  defaultLocation?: string;
  defaultPriority?: "standard" | "urgent" | "emergency";
}

const priorityStyles = {
  standard: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  urgent: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  emergency: "bg-red-500/20 text-red-400 border-red-500/30",
};

const missionTypes = [
  { value: "medical", label: "Medical Aid", icon: "🏥" },
  { value: "nutrition", label: "Nutrition Support", icon: "🍲" },
  { value: "water", label: "Water & Sanitation", icon: "💧" },
  { value: "shelter", label: "Shelter & Safety", icon: "🏠" },
  { value: "multi-purpose", label: "Multi-Purpose Response", icon: "🎯" },
];

export const DeployTeamDialog = ({
  open,
  onOpenChange,
  alertId,
  defaultLocation = "",
  defaultPriority = "standard",
}: DeployTeamDialogProps) => {
  const { deployTeam, loading, lastDeployment } = useDeployTeam();
  const [deployed, setDeployed] = useState(false);

  const [formData, setFormData] = useState({
    location: defaultLocation,
    priority: defaultPriority as "standard" | "urgent" | "emergency",
    teamSize: 1,
    missionType: "multi-purpose" as "medical" | "nutrition" | "water" | "shelter" | "multi-purpose",
    notes: "",
  });

  const handleDeploy = async () => {
    if (!formData.location.trim()) return;

    const result = await deployTeam({
      alertId,
      location: formData.location,
      priority: formData.priority,
      teamSize: formData.teamSize,
      missionType: formData.missionType,
      notes: formData.notes,
    });

    if (result) {
      setDeployed(true);
    }
  };

  const handleClose = () => {
    setDeployed(false);
    setFormData({
      location: defaultLocation,
      priority: defaultPriority,
      teamSize: 1,
      missionType: "multi-purpose",
      notes: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <Zap className="w-5 h-5 text-terracotta" />
            Deploy Response Team
          </DialogTitle>
          <DialogDescription>
            Dispatch mobile response swarms to provide rapid assistance.
          </DialogDescription>
        </DialogHeader>

        {deployed && lastDeployment ? (
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Team Deployed!</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {lastDeployment.teams_deployed} team(s) dispatched to {lastDeployment.location}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline" className={priorityStyles[lastDeployment.priority as keyof typeof priorityStyles]}>
                    {lastDeployment.priority}
                  </Badge>
                  <Badge variant="outline">{lastDeployment.mission_type}</Badge>
                </div>
                <p className="text-muted-foreground">
                  ETA: <span className="text-foreground font-medium">{lastDeployment.estimated_arrival}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Teams: {lastDeployment.team_names.join(", ")}
                </p>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full mt-4">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Deployment Location
              </Label>
              <Input
                id="location"
                placeholder="Enter location or coordinates"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Priority Level
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(["standard", "urgent", "emergency"] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={cn(
                      "px-3 py-2 rounded-lg border text-sm font-medium transition-all capitalize",
                      formData.priority === priority
                        ? priorityStyles[priority]
                        : "bg-card border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {priority}
                  </button>
                ))}
              </div>
              {formData.priority === "emergency" && (
                <p className="text-xs text-red-400">Emergency: Teams deploy within 30 minutes</p>
              )}
            </div>

            {/* Mission Type */}
            <div className="space-y-2">
              <Label>Mission Type</Label>
              <Select
                value={formData.missionType}
                onValueChange={(value: typeof formData.missionType) =>
                  setFormData({ ...formData, missionType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {missionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Team Size */}
            <div className="space-y-2">
              <Label htmlFor="teamSize" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Teams
              </Label>
              <Select
                value={formData.teamSize.toString()}
                onValueChange={(value) => setFormData({ ...formData, teamSize: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Team{num > 1 ? "s" : ""} (3-5 members each)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Special instructions or context..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Deploy Button */}
            <Button
              onClick={handleDeploy}
              disabled={loading || !formData.location.trim()}
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Deploy Response Team
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
