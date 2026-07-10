'use client';

import React from 'react';
import { SatelliteTelemetry, SpaceWeather } from '../lib/multidomain';
import { Radio, AlertTriangle, CloudSun, Shield } from 'lucide-react';

interface SpaceFeedProps {
  satellites: SatelliteTelemetry[];
  spaceWeather: SpaceWeather;
}

export const SpaceFeed: React.FC<SpaceFeedProps> = ({ satellites, spaceWeather }) => {
  const getStatusColor = (status: SatelliteTelemetry['status']) => {
    switch (status) {
      case 'NOMINAL': return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
      case 'DEGRADED': return 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20';
      case 'MAINTENANCE': return 'text-blue-400 border-blue-500/20 bg-blue-950/20';
      case 'OFFLINE': return 'text-red-500 border-red-500/20 bg-red-950/20 animate-pulse';
      default: return 'text-secondary border-border bg-slate-950/10';
    }
  };

  const getSolarFlareColor = (level: SpaceWeather['solarFlareLevel']) => {
    switch (level) {
      case 'QUIET': return 'text-emerald-400';
      case 'MODERATE': return 'text-cyan-400';
      case 'ACTIVE': return 'text-yellow-500';
      case 'SEVERE': return 'text-red-500 animate-pulse';
      default: return 'text-secondary';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/40 h-full font-mono text-xs">
      {/* Satellite Telemetry Grid */}
      <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
        <div className="px-4 py-2 border-b border-border/40 bg-slate-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Orbital Reconnaissance Telemetry</span>
          </div>
          <div className="text-[9px] text-secondary">
            ACTIVE ASSETS: {satellites.filter(s => s.status !== 'OFFLINE').length} / {satellites.length}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/20 max-h-[280px]">
          {satellites.map((sat) => (
            <div key={sat.name} className="p-3 hover:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-foreground font-semibold flex items-center gap-2">
                  {sat.name}
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${getStatusColor(sat.status)}`}>
                    {sat.status}
                  </span>
                </div>
                <div className="text-secondary/70 text-[10px] flex items-center gap-4">
                  <span>Orbit: <strong className="text-foreground">{sat.orbit}</strong></span>
                  <span>Azimuth: <strong className="text-foreground">{sat.azimuth}°</strong></span>
                  <span>Elevation: <strong className="text-foreground">{sat.elevation}°</strong></span>
                </div>
              </div>

              <div className="w-full sm:w-40 flex flex-col gap-1">
                <div className="flex justify-between text-[9px] text-secondary">
                  <span>Uplink Signal</span>
                  <span className={sat.uplinkStrength > 80 ? "text-emerald-400" : sat.uplinkStrength > 40 ? "text-primary" : "text-red-500"}>
                    {sat.uplinkStrength}% ({sat.bandwidth})
                  </span>
                </div>
                <div className="h-1.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      sat.uplinkStrength > 80 ? "bg-emerald-500" : sat.uplinkStrength > 40 ? "bg-primary" : "bg-red-500"
                    }`}
                    style={{ width: `${sat.uplinkStrength}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Space Weather Environmental Panel */}
      <div className="p-4 bg-slate-950/20 flex flex-col justify-between gap-4 h-full shrink-0">
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-border/40 pb-2">
            <span className="text-[10px] font-bold uppercase text-secondary tracking-widest">Orbital Weather Alert</span>
            <CloudSun size={14} className="text-primary" />
          </div>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center bg-slate-900/40 p-2 border border-border/30 rounded">
              <span className="text-secondary text-[9px] uppercase">Solar Flare Status</span>
              <span className={`font-bold ${getSolarFlareColor(spaceWeather.solarFlareLevel)}`}>
                {spaceWeather.solarFlareLevel}
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/40 p-2 border border-border/30 rounded">
              <span className="text-secondary text-[9px] uppercase">Geomagnetic Kp-Index</span>
              <span className="text-primary font-bold">{spaceWeather.geomagneticIndex}</span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/40 p-2 border border-border/30 rounded">
              <span className="text-secondary text-[9px] uppercase">Radiation Belt Stability</span>
              <span className="text-emerald-400 font-bold">{spaceWeather.radiationBelt}</span>
            </div>
          </div>
        </div>

        {spaceWeather.solarFlareLevel === 'SEVERE' ? (
          <div className="bg-red-950/20 border border-red-500/20 p-3 rounded-lg flex gap-2.5 items-start animate-pulse">
            <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-[9px] text-red-500 font-bold uppercase">Solar Flare Warning</div>
              <p className="text-[9px] text-secondary leading-tight">
                Severe geomagnetic disturbance detected. Expect intermittent uplink degradation on LEO orbits.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-cyan-950/10 border border-cyan-500/20 p-3 rounded-lg flex gap-2.5 items-start">
            <Shield size={14} className="text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-[9px] text-cyan-400 font-bold uppercase">Signal Matrix Calibrated</div>
              <p className="text-[9px] text-secondary leading-tight">
                All polar and equatorial orbital paths are operating under standard communication bands.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
