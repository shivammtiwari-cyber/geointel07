'use client';

import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from 'react-simple-maps';
import geoData from '../public/features.json';

interface WorldMapProps {
  onSelectCountry: (name: string | null) => void;
  intensities?: Record<string, number>;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onSelectCountry, intensities = {} }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIntensityFill = (regionName: string) => {
    const score = intensities[regionName] || 0;
    if (score > 80) return "url(#grad-critical)";
    if (score > 60) return "url(#grad-elevated)";
    if (score > 40) return "url(#grad-unstable)";
    if (score > 0) return "url(#grad-stable-active)";
    return "#0f172a";
  };

  console.log("Tactics Payload:", !!geoData, (geoData as any)?.objects?.countries?.geometries?.length);

  return (
    <div className="w-full h-[450px] bg-slate-950/20 rounded-lg border border-border/50 overflow-hidden relative flex items-center justify-center">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-bold">
          Global Surveillance
        </div>
        <div className="text-xl font-mono text-primary flex items-center gap-2">
          {hovered || "WORLD_READY"}
          <span className="w-2 h-4 bg-primary animate-pulse" />
        </div>
        {hovered && intensities[hovered] && (
          <div className="text-[10px] font-mono text-destructive uppercase">
            Conflict Intensity: {intensities[hovered].toFixed(1)} / 100
          </div>
        )}
      </div>

      <div className="w-full h-full p-4">
        <ComposableMap
            projection="geoEqualEarth"
            width={800}
            height={400}
            projectionConfig={{ scale: 160 }}
            style={{ width: "100%", height: "100%" }}
        >
            <defs>
                <radialGradient id="grad-critical" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                    <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.8" />
                </radialGradient>
                <radialGradient id="grad-elevated" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#78350f" stopOpacity="0.6" />
                </radialGradient>
                <radialGradient id="grad-unstable" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#083344" stopOpacity="0.6" />
                </radialGradient>
                <radialGradient id="grad-stable-active" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#334155" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
                </radialGradient>
            </defs>

            <Sphere stroke="#334155" strokeWidth={0.5} fill="transparent" />
            <Graticule stroke="#1e293b" strokeWidth={0.5} />
            <Geographies geography={geoData}>
            {({ geographies }) =>
                geographies.map((geo) => {
                    const countryIntensity = intensities[geo.properties.name] || 0;
                    return (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => setHovered(geo.properties.name)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => onSelectCountry(geo.properties.name)}
                            style={{
                                default: { 
                                    fill: getIntensityFill(geo.properties.name), 
                                    stroke: countryIntensity > 50 ? "#ef4444" : "#1e293b", 
                                    strokeWidth: countryIntensity > 50 ? 0.7 : 0.5, 
                                    outline: "none" 
                                },
                                hover: { fill: "#164e63", stroke: "#06b6d4", strokeWidth: 1, outline: "none", cursor: "pointer" },
                                pressed: { fill: "#0891b2", outline: "none" },
                            }}
                        />
                    );
                })
            }
            </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};


