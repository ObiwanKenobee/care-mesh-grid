import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeploymentRequest {
  alertId?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  priority: "standard" | "urgent" | "emergency";
  teamSize: number;
  missionType: "medical" | "nutrition" | "water" | "shelter" | "multi-purpose";
  notes?: string;
}

interface DeploymentResult {
  id: string;
  teams_deployed: number;
  team_names: string[];
  location: string;
  mission_type: string;
  priority: string;
  estimated_arrival: string;
  status: string;
}

export const useDeployTeam = () => {
  const [loading, setLoading] = useState(false);
  const [lastDeployment, setLastDeployment] = useState<DeploymentResult | null>(null);

  const deployTeam = async (request: DeploymentRequest): Promise<DeploymentResult | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("deploy-response-team", {
        body: request,
      });

      if (error) {
        console.error("Deployment error:", error);
        toast.error("Failed to deploy response team");
        return null;
      }

      if (!data.success) {
        toast.error(data.error || "Deployment failed");
        return null;
      }

      setLastDeployment(data.deployment);
      toast.success(`${data.deployment.teams_deployed} team(s) deployed to ${request.location}`);
      return data.deployment;
    } catch (err) {
      console.error("Deploy team error:", err);
      toast.error("Failed to deploy response team");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deployTeam, loading, lastDeployment };
};
