import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle } from 'lucide-react';

interface Region {
  name: string;
  type: string;
  coordinates: [number, number];
  distressLevel: 'critical' | 'high' | 'moderate';
}

const regions: Region[] = [
  { name: "Sudan's famine arc", type: "Crisis Zone", coordinates: [30.0, 15.5], distressLevel: 'critical' },
  { name: "Somalia drought belt", type: "Climate Emergency", coordinates: [46.0, 5.0], distressLevel: 'critical' },
  { name: "Rohingya camps, Cox's Bazar", type: "Refugee Settlement", coordinates: [92.0, 21.4], distressLevel: 'high' },
  { name: "CAR conflict zones", type: "Conflict Zone", coordinates: [20.9, 6.6], distressLevel: 'critical' },
  { name: "Kibera, Nairobi", type: "Urban Density", coordinates: [36.8, -1.3], distressLevel: 'high' },
  { name: "Mathare, Nairobi", type: "Urban Density", coordinates: [36.86, -1.26], distressLevel: 'high' },
  { name: "Mountainous Nepal", type: "Remote Access", coordinates: [84.1, 28.4], distressLevel: 'moderate' },
];

const distressColors = {
  critical: '#e85a4f',
  high: '#e8a84f',
  moderate: '#4e9a8c',
};

const ImpactMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem('mapbox_token') || '';
  });
  const [tokenInput, setTokenInput] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  const saveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 1.8,
        center: [40, 10],
        pitch: 20,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.scrollZoom.disable();

      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'hsl(30, 25%, 8%)',
          'high-color': 'hsl(30, 20%, 15%)',
          'horizon-blend': 0.1,
          'space-color': 'hsl(30, 25%, 4%)',
          'star-intensity': 0.3,
        });

        setIsMapReady(true);
      });

      // Slow rotation
      const secondsPerRevolution = 300;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let userInteracting = false;

      function spinGlobe() {
        if (!map.current) return;
        const zoom = map.current.getZoom();
        if (!userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.current.getCenter();
          center.lng -= distancePerSecond;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      map.current.on('mousedown', () => { userInteracting = true; });
      map.current.on('dragstart', () => { userInteracting = true; });
      map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
      map.current.on('touchend', () => { userInteracting = false; spinGlobe(); });
      map.current.on('moveend', () => { spinGlobe(); });

      spinGlobe();

    } catch (error) {
      console.error('Map initialization error:', error);
      localStorage.removeItem('mapbox_token');
      setMapboxToken('');
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Add markers after map is ready
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    regions.forEach((region) => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div class="marker-container" style="position: relative; cursor: pointer;">
          <div class="pulse-ring" style="
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: ${distressColors[region.distressLevel]};
            opacity: 0.3;
            animation: pulse-ring 2s ease-out infinite;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "></div>
          <div class="marker-dot" style="
            position: relative;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: ${distressColors[region.distressLevel]};
            border: 2px solid hsl(35, 30%, 92%);
            box-shadow: 0 0 10px ${distressColors[region.distressLevel]};
          "></div>
        </div>
      `;

      // Add CSS animation
      if (!document.getElementById('marker-styles')) {
        const style = document.createElement('style');
        style.id = 'marker-styles';
        style.textContent = `
          @keyframes pulse-ring {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.4; }
            100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup',
      }).setHTML(`
        <div style="
          background: hsl(30, 20%, 10%);
          border: 1px solid hsl(30, 15%, 20%);
          border-radius: 12px;
          padding: 12px 16px;
          color: hsl(35, 30%, 92%);
          font-family: 'Inter', sans-serif;
          min-width: 180px;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          ">
            <div style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: ${distressColors[region.distressLevel]};
              box-shadow: 0 0 8px ${distressColors[region.distressLevel]};
            "></div>
            <span style="
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: hsl(35, 15%, 55%);
            ">${region.type}</span>
          </div>
          <h3 style="
            font-family: 'Source Serif 4', Georgia, serif;
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 6px 0;
          ">${region.name}</h3>
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: ${distressColors[region.distressLevel]};
          ">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span style="text-transform: capitalize;">${region.distressLevel} distress</span>
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(region.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Add popup styles
    if (!document.getElementById('popup-styles')) {
      const style = document.createElement('style');
      style.id = 'popup-styles';
      style.textContent = `
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, [isMapReady]);

  if (!mapboxToken) {
    return (
      <div className="w-full h-[500px] rounded-2xl bg-card/30 border border-border flex flex-col items-center justify-center p-8">
        <MapPin className="w-12 h-12 text-terracotta mb-4" />
        <h3 className="font-serif text-xl font-semibold mb-2">Interactive Globe</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Enter your Mapbox public token to view the interactive impact regions map. 
          Get your free token at{' '}
          <a 
            href="https://mapbox.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-terracotta hover:underline"
          >
            mapbox.com
          </a>
        </p>
        <div className="flex gap-3 w-full max-w-md">
          <Input
            type="text"
            placeholder="pk.eyJ1..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1 bg-secondary/50 border-border"
          />
          <Button variant="warm" onClick={saveToken}>
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 z-10">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Distress Levels</p>
        <div className="space-y-2">
          {(['critical', 'high', 'moderate'] as const).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  background: distressColors[level],
                  boxShadow: `0 0 8px ${distressColors[level]}`,
                }}
              />
              <span className="text-sm capitalize text-foreground/80">{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active signals indicator */}
      <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-xl px-4 py-3 z-10 flex items-center gap-3">
        <div className="relative">
          <AlertTriangle className="w-4 h-4 text-terracotta" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-terracotta rounded-full animate-pulse" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Active Distress Signals</p>
          <p className="text-lg font-semibold text-foreground">{regions.length} Regions</p>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
    </div>
  );
};

export default ImpactMap;
