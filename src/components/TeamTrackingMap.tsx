import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapboxToken } from "@/hooks/useMapboxToken";
import { useGridNodes } from "@/hooks/useGridData";
import { Loader2 } from "lucide-react";

interface TeamLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "en_route" | "on_site" | "returning";
  missionType?: string;
}

interface TeamTrackingMapProps {
  className?: string;
  deployedTeams?: TeamLocation[];
}

const TeamTrackingMap: React.FC<TeamTrackingMapProps> = ({ className = "", deployedTeams = [] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { token, loading: tokenLoading, error: tokenError } = useMapboxToken();
  const { nodes } = useGridNodes();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter nodes with coordinates
  const nodesWithCoords = nodes.filter(
    (n) => n.latitude !== null && n.longitude !== null
  );

  // Combine deployed teams with response swarm nodes for visualization
  const allTeamLocations: TeamLocation[] = [
    ...deployedTeams,
    ...nodesWithCoords
      .filter((n) => n.component_type === "response_swarms")
      .map((n) => ({
        id: n.id,
        name: n.name,
        lat: Number(n.latitude),
        lng: Number(n.longitude),
        status: n.status === "processing" ? "en_route" as const : "on_site" as const,
      })),
  ];

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      projection: "globe",
      zoom: 2,
      center: [20, 5],
      pitch: 30,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    map.current.on("style.load", () => {
      map.current?.setFog({
        color: "rgb(20, 20, 30)",
        "high-color": "rgb(40, 40, 60)",
        "horizon-blend": 0.2,
      });
      setMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      map.current?.remove();
    };
  }, [token]);

  // Update markers when teams change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for all team locations
    allTeamLocations.forEach((team) => {
      const el = document.createElement("div");
      el.className = "team-marker";
      el.innerHTML = `
        <div class="relative">
          <div class="w-6 h-6 rounded-full flex items-center justify-center ${
            team.status === "en_route"
              ? "bg-amber-500 animate-pulse"
              : team.status === "on_site"
              ? "bg-green-500"
              : "bg-blue-500"
          }">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          ${
            team.status === "en_route"
              ? '<div class="absolute -inset-2 rounded-full bg-amber-500/30 animate-ping"></div>'
              : ""
          }
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2 text-sm">
          <div class="font-semibold">${team.name}</div>
          <div class="text-xs opacity-75 capitalize">${team.status.replace("_", " ")}</div>
          ${team.missionType ? `<div class="text-xs mt-1">${team.missionType}</div>` : ""}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([team.lng, team.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Add markers for other nodes (non-response swarms)
    nodesWithCoords
      .filter((n) => n.component_type !== "response_swarms")
      .forEach((node) => {
        const color =
          node.component_type === "micro_hub"
            ? "#C4704F"
            : node.component_type === "sensing_mesh"
            ? "#F59E0B"
            : "#2E6B5A";

        const el = document.createElement("div");
        el.className = "node-marker";
        el.innerHTML = `
          <div class="w-4 h-4 rounded-full border-2" style="background: ${color}20; border-color: ${color}"></div>
        `;

        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(`
          <div class="p-2 text-sm">
            <div class="font-semibold">${node.name}</div>
            <div class="text-xs opacity-75 capitalize">${node.component_type.replace("_", " ")}</div>
            <div class="text-xs">${node.region}</div>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([Number(node.longitude), Number(node.latitude)])
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
  }, [allTeamLocations, nodesWithCoords, mapLoaded]);

  if (tokenLoading) {
    return (
      <div className={`flex items-center justify-center bg-card/50 rounded-xl ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className={`flex items-center justify-center bg-card/50 rounded-xl ${className}`}>
        <div className="text-center text-muted-foreground">
          <p>Failed to load map</p>
          <p className="text-xs mt-1">{tokenError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/20 to-transparent" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-2">
        <div className="font-semibold mb-2">Team Status</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
          <span>En Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>On Site</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Returning</span>
        </div>
      </div>
    </div>
  );
};

export default TeamTrackingMap;
