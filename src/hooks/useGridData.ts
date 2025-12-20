import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type GridNode = Database["public"]["Tables"]["grid_nodes"]["Row"];
type Alert = Database["public"]["Tables"]["alerts"]["Row"];
type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
type SystemMetric = Database["public"]["Tables"]["system_metrics"]["Row"];

export const useGridNodes = () => {
  const [nodes, setNodes] = useState<GridNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodes = async () => {
      const { data, error } = await supabase
        .from("grid_nodes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setNodes(data || []);
      }
      setLoading(false);
    };

    fetchNodes();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("grid_nodes_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "grid_nodes" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNodes((prev) => [payload.new as GridNode, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setNodes((prev) =>
              prev.map((n) => (n.id === payload.new.id ? (payload.new as GridNode) : n))
            );
          } else if (payload.eventType === "DELETE") {
            setNodes((prev) => prev.filter((n) => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { nodes, loading, error };
};

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setAlerts(data || []);
      }
      setLoading(false);
    };

    fetchAlerts();

    const channel = supabase
      .channel("alerts_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setAlerts((prev) => [payload.new as Alert, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setAlerts((prev) =>
              prev.map((a) => (a.id === payload.new.id ? (payload.new as Alert) : a))
            );
          } else if (payload.eventType === "DELETE") {
            setAlerts((prev) => prev.filter((a) => a.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateAlertStatus = async (id: string, status: Alert["status"]) => {
    const updates: Partial<Alert> = { status };
    if (status === "acknowledged") updates.acknowledged_at = new Date().toISOString();
    if (status === "resolved") updates.resolved_at = new Date().toISOString();

    const { error } = await supabase.from("alerts").update(updates).eq("id", id);
    return { error };
  };

  return { alerts, loading, error, updateAlertStatus };
};

export const useActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      setLogs(data || []);
      setLoading(false);
    };

    fetchLogs();

    const channel = supabase
      .channel("activity_logs_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_logs" },
        (payload) => {
          setLogs((prev) => [payload.new as ActivityLog, ...prev.slice(0, 49)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { logs, loading };
};

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data } = await supabase
        .from("system_metrics")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(100);

      setMetrics(data || []);
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  const getLatestMetric = (name: string) => {
    return metrics.find((m) => m.metric_name === name);
  };

  return { metrics, loading, getLatestMetric };
};
