import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, X, Users, Droplets, Heart, Wifi, ThermometerSun, Package } from 'lucide-react';

interface Region {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  distressLevel: 'critical' | 'high' | 'moderate';
  stats: {
    population: string;
    volunteers: number;
    microHubs: number;
    signalsToday: number;
    waterAccess: number;
    foodSecurity: number;
    healthcareReach: number;
    connectivity: number;
  };
}

const regions: Region[] = [
  { 
    id: 'sudan',
    name: "Sudan's famine arc", 
    type: "Crisis Zone", 
    coordinates: [30.0, 15.5], 
    distressLevel: 'critical',
    stats: {
      population: '2.4M affected',
      volunteers: 342,
      microHubs: 18,
      signalsToday: 847,
      waterAccess: 23,
      foodSecurity: 12,
      healthcareReach: 31,
      connectivity: 45,
    }
  },
  { 
    id: 'somalia',
    name: "Somalia drought belt", 
    type: "Climate Emergency", 
    coordinates: [46.0, 5.0], 
    distressLevel: 'critical',
    stats: {
      population: '1.8M affected',
      volunteers: 256,
      microHubs: 12,
      signalsToday: 623,
      waterAccess: 18,
      foodSecurity: 15,
      healthcareReach: 22,
      connectivity: 38,
    }
  },
  { 
    id: 'rohingya',
    name: "Rohingya camps, Cox's Bazar", 
    type: "Refugee Settlement", 
    coordinates: [92.0, 21.4], 
    distressLevel: 'high',
    stats: {
      population: '890K displaced',
      volunteers: 523,
      microHubs: 34,
      signalsToday: 412,
      waterAccess: 56,
      foodSecurity: 48,
      healthcareReach: 61,
      connectivity: 72,
    }
  },
  { 
    id: 'car',
    name: "CAR conflict zones", 
    type: "Conflict Zone", 
    coordinates: [20.9, 6.6], 
    distressLevel: 'critical',
    stats: {
      population: '1.2M affected',
      volunteers: 178,
      microHubs: 8,
      signalsToday: 534,
      waterAccess: 29,
      foodSecurity: 21,
      healthcareReach: 18,
      connectivity: 25,
    }
  },
  { 
    id: 'kibera',
    name: "Kibera, Nairobi", 
    type: "Urban Density", 
    coordinates: [36.8, -1.3], 
    distressLevel: 'high',
    stats: {
      population: '350K residents',
      volunteers: 412,
      microHubs: 22,
      signalsToday: 289,
      waterAccess: 42,
      foodSecurity: 51,
      healthcareReach: 45,
      connectivity: 68,
    }
  },
  { 
    id: 'mathare',
    name: "Mathare, Nairobi", 
    type: "Urban Density", 
    coordinates: [36.86, -1.26], 
    distressLevel: 'high',
    stats: {
      population: '200K residents',
      volunteers: 287,
      microHubs: 14,
      signalsToday: 198,
      waterAccess: 38,
      foodSecurity: 46,
      healthcareReach: 41,
      connectivity: 65,
    }
  },
  { 
    id: 'nepal',
    name: "Mountainous Nepal", 
    type: "Remote Access", 
    coordinates: [84.1, 28.4], 
    distressLevel: 'moderate',
    stats: {
      population: '120K isolated',
      volunteers: 156,
      microHubs: 9,
      signalsToday: 87,
      waterAccess: 67,
      foodSecurity: 72,
      healthcareReach: 34,
      connectivity: 28,
    }
  },
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
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const saveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  const flyToRegion = (region: Region) => {
    if (!map.current || isAnimating) return;
    
    setIsAnimating(true);
    setSelectedRegion(region);
    
    map.current.flyTo({
      center: region.coordinates,
      zoom: 6,
      pitch: 45,
      bearing: Math.random() * 30 - 15,
      duration: 2000,
      essential: true,
    });

    setTimeout(() => setIsAnimating(false), 2000);
  };

  const resetView = () => {
    if (!map.current) return;
    
    setSelectedRegion(null);
    map.current.flyTo({
      center: [40, 10],
      zoom: 1.8,
      pitch: 20,
      bearing: 0,
      duration: 1500,
    });
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

      // Slow rotation when not focused
      const secondsPerRevolution = 300;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let userInteracting = false;

      function spinGlobe() {
        if (!map.current || selectedRegion) return;
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
      el.style.cursor = 'pointer';
      el.innerHTML = `
        <div class="marker-container" style="position: relative;">
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
            transition: transform 0.2s ease;
          "></div>
        </div>
      `;

      // Hover effect
      el.addEventListener('mouseenter', () => {
        const dot = el.querySelector('.marker-dot') as HTMLElement;
        if (dot) dot.style.transform = 'scale(1.3)';
      });
      el.addEventListener('mouseleave', () => {
        const dot = el.querySelector('.marker-dot') as HTMLElement;
        if (dot) dot.style.transform = 'scale(1)';
      });

      // Click handler
      el.addEventListener('click', () => {
        flyToRegion(region);
      });

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

      const marker = new mapboxgl.Marker(el)
        .setLngLat(region.coordinates)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [isMapReady]);

  const StatBar = ({ value, color }: { value: number; color: string }) => (
    <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ 
          width: `${value}%`, 
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    </div>
  );

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
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Selected Region Detail Panel */}
      {selectedRegion && (
        <div className="absolute top-4 right-16 w-80 bg-card/95 backdrop-blur-md border border-border rounded-2xl p-5 z-20 animate-fade-in shadow-xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ 
                    background: distressColors[selectedRegion.distressLevel],
                    boxShadow: `0 0 8px ${distressColors[selectedRegion.distressLevel]}`,
                  }}
                />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {selectedRegion.type}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold">{selectedRegion.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selectedRegion.stats.population}</p>
            </div>
            <button 
              onClick={resetView}
              className="p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center p-3 bg-secondary/30 rounded-xl">
              <Users className="w-4 h-4 mx-auto mb-1 text-terracotta" />
              <p className="text-lg font-semibold">{selectedRegion.stats.volunteers}</p>
              <p className="text-xs text-muted-foreground">Volunteers</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-xl">
              <Package className="w-4 h-4 mx-auto mb-1 text-amber" />
              <p className="text-lg font-semibold">{selectedRegion.stats.microHubs}</p>
              <p className="text-xs text-muted-foreground">Micro-Hubs</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-xl">
              <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-forest" />
              <p className="text-lg font-semibold">{selectedRegion.stats.signalsToday}</p>
              <p className="text-xs text-muted-foreground">Signals/24h</p>
            </div>
          </div>

          {/* Sensor Data */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Live Sensor Data</p>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="w-3.5 h-3.5" />
                  Water Access
                </span>
                <span className="font-medium">{selectedRegion.stats.waterAccess}%</span>
              </div>
              <StatBar value={selectedRegion.stats.waterAccess} color={distressColors[selectedRegion.stats.waterAccess < 30 ? 'critical' : selectedRegion.stats.waterAccess < 50 ? 'high' : 'moderate']} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ThermometerSun className="w-3.5 h-3.5" />
                  Food Security
                </span>
                <span className="font-medium">{selectedRegion.stats.foodSecurity}%</span>
              </div>
              <StatBar value={selectedRegion.stats.foodSecurity} color={distressColors[selectedRegion.stats.foodSecurity < 30 ? 'critical' : selectedRegion.stats.foodSecurity < 50 ? 'high' : 'moderate']} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="w-3.5 h-3.5" />
                  Healthcare Reach
                </span>
                <span className="font-medium">{selectedRegion.stats.healthcareReach}%</span>
              </div>
              <StatBar value={selectedRegion.stats.healthcareReach} color={distressColors[selectedRegion.stats.healthcareReach < 30 ? 'critical' : selectedRegion.stats.healthcareReach < 50 ? 'high' : 'moderate']} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Wifi className="w-3.5 h-3.5" />
                  Connectivity
                </span>
                <span className="font-medium">{selectedRegion.stats.connectivity}%</span>
              </div>
              <StatBar value={selectedRegion.stats.connectivity} color={distressColors[selectedRegion.stats.connectivity < 30 ? 'critical' : selectedRegion.stats.connectivity < 50 ? 'high' : 'moderate']} />
            </div>
          </div>

          {/* Action Button */}
          <Button variant="warm" className="w-full mt-5" size="lg">
            Deploy Response Team
          </Button>
        </div>
      )}
      
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
          <p className="text-lg font-semibold text-foreground">{regions.reduce((sum, r) => sum + r.stats.signalsToday, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Instruction hint */}
      {!selectedRegion && (
        <div className="absolute bottom-4 right-4 bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 z-10">
          <p className="text-xs text-muted-foreground">Click a marker to explore region data</p>
        </div>
      )}

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
    </div>
  );
};

export default ImpactMap;
