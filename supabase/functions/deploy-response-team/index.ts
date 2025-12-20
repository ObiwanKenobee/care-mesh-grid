import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body: DeploymentRequest = await req.json();
    const { alertId, location, latitude, longitude, priority, teamSize, missionType, notes } = body;

    console.log("Deploying response team:", { location, priority, missionType, teamSize });

    // Find available response swarm nodes
    const { data: availableNodes, error: nodesError } = await supabase
      .from("grid_nodes")
      .select("*")
      .eq("component_type", "response_swarms")
      .eq("status", "active")
      .order("uptime_percent", { ascending: false })
      .limit(teamSize);

    if (nodesError) {
      console.error("Error fetching nodes:", nodesError);
      throw new Error("Failed to find available response teams");
    }

    if (!availableNodes || availableNodes.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No response teams currently available",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Update node statuses to "processing" (deploying)
    const nodeIds = availableNodes.map((n) => n.id);
    const { error: updateError } = await supabase
      .from("grid_nodes")
      .update({ status: "processing" })
      .in("id", nodeIds);

    if (updateError) {
      console.error("Error updating node status:", updateError);
    }

    // Create deployment record in activity logs
    const deploymentId = crypto.randomUUID();
    const { error: logError } = await supabase.from("activity_logs").insert({
      action: "RESPONSE_TEAM_DEPLOYED",
      description: `Deployed ${availableNodes.length} response team(s) to ${location} for ${missionType} mission`,
      metadata: {
        deployment_id: deploymentId,
        alert_id: alertId,
        location,
        latitude,
        longitude,
        priority,
        team_size: availableNodes.length,
        mission_type: missionType,
        deployed_nodes: nodeIds,
        notes,
        estimated_arrival: priority === "emergency" ? "30 minutes" : priority === "urgent" ? "1 hour" : "2 hours",
      },
      data_transferred_mb: 0.5,
    });

    if (logError) {
      console.error("Error creating activity log:", logError);
    }

    // If linked to an alert, update its status
    if (alertId) {
      const { error: alertError } = await supabase
        .from("alerts")
        .update({ status: "in_progress" })
        .eq("id", alertId);

      if (alertError) {
        console.error("Error updating alert:", alertError);
      }
    }

    // Create a new alert for the deployment
    const { error: newAlertError } = await supabase.from("alerts").insert({
      title: `Response Team Deployed: ${missionType}`,
      description: `${availableNodes.length} team(s) dispatched to ${location}. Priority: ${priority}. ${notes || ""}`,
      severity: priority === "emergency" ? "critical" : priority === "urgent" ? "warning" : "info",
      status: "in_progress",
      location,
      latitude,
      longitude,
      metadata: {
        deployment_id: deploymentId,
        source_alert_id: alertId,
        mission_type: missionType,
        deployed_nodes: nodeIds,
      },
    });

    if (newAlertError) {
      console.error("Error creating deployment alert:", newAlertError);
    }

    const response = {
      success: true,
      deployment: {
        id: deploymentId,
        teams_deployed: availableNodes.length,
        team_names: availableNodes.map((n) => n.name),
        location,
        mission_type: missionType,
        priority,
        estimated_arrival: priority === "emergency" ? "30 minutes" : priority === "urgent" ? "1 hour" : "2 hours",
        status: "en_route",
      },
    };

    console.log("Deployment successful:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Deployment error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
