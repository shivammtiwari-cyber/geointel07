'use client';

import React, { useEffect, useRef } from 'react';
import { Activity, AlertTriangle, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { audioAlerts } from '../lib/audio';

interface RedlineMonitorProps {
  intensities: Record<string, number>;
}

export const RedlineMonitor: React.FC<RedlineMonitorProps> = ({ intensities }) => {
  const sortedRegions = Object.entries(intensities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const prevCriticalRef = useRef<boolean>(false);

  useEffect(() => {
    const hasCritical = sortedRegions.some(([, score]) => score > 80);
    if (hasCritical && !prevCriticalRef.current) {
        audioAlerts?.playRedlineAlert();
    }
    prevCriticalRef.current = hasCritical;
  }, [intensities]);


  const getStatusColor = (score: number) => {
    if (score > 70) return 'text-destructive';
    if (score > 40) return 'text-accent';
    return 'text-success';
  };

  const getStatusLabel = (score: number) => {
    if (score > 80) return 'CRITICAL';
    if (score > 60) return 'ELEVATED';
    if (score > 40) return 'UNSTABLE';
    return 'STABLE';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2 text-primary">
          <Activity size={18} />
          <h2 className="text-sm font-bold uppercase tracking-wider">Redline Monitor</h2>
        </div>
        <div className="px-2 py-0.5 rounded bg-destructive/10 border border-destructive/30 text-[10px] text-destructive font-mono animate-pulse">
           THREAT_LEVEL: DETECTED
        </div>
      </div>

      <div className="space-y-4">
        {sortedRegions.map(([region, score]) => (
          <div key={region} className="group">
            <div className="flex justify-between items-end mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-foreground uppercase">{region}</span>
                {score > 70 && <Flame size={12} className="text-destructive animate-bounce" />}
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-[10px] font-bold ${getStatusColor(score)}`}>
                  {getStatusLabel(score)}
                </span>
                <span className="text-sm font-mono text-secondary">
                  {score.toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="relative h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className={`absolute left-0 top-0 h-full ${score > 70 ? 'bg-destructive shadow-[0_0_10px_#ef4444]' : score > 40 ? 'bg-accent' : 'bg-success'}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              
              {/* Threshold Markers */}
              <div className="absolute left-[50%] top-0 w-px h-full bg-white/10" />
              <div className="absolute left-[80%] top-0 w-px h-full bg-destructive/20" title="Redline Threshold" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-slate-950 border border-border/50 rounded-lg flex gap-3 items-start">
        <div className="p-1.5 bg-accent/10 border border-accent/20 rounded text-accent">
          <AlertTriangle size={14} />
        </div>
        <div className="space-y-1">
          <div className="text-[10px] text-accent font-bold uppercase">Intelligence Alert</div>
          <p className="text-[10px] text-secondary leading-tight italic">
            Automated escalation detection triggered in {sortedRegions[0]?.[0]} sector. Recommend satellite repositioning.
          </p>
        </div>
      </div>
    </div>
  );
};
