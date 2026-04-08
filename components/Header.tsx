'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, Crosshair, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="h-16 border-b border-border bg-slate-950" />;

  const formatTime = (date: Date) => {
    return date.toISOString().split('T')[1].split('.')[0] + 'Z';
  };

  return (
    <header className="h-16 border-b border-border bg-slate-950 flex items-center justify-between px-6 shrink-0 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-primary" />
        <div className="absolute top-0 left-[20%] w-[1px] h-full bg-primary" />
        <div className="absolute top-0 right-[20%] w-[1px] h-full bg-primary" />
      </div>

      <div className="flex items-center gap-8 relative z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/40 rounded flex items-center justify-center">
                <Crosshair className="text-primary animate-spin-slow" size={24} />
            </div>
            <div>
                <h1 className="text-lg font-bold uppercase tracking-tighter leading-none">GeoIntel</h1>
                <span className="text-[10px] text-primary/60 font-mono">v4.2.0-STABLE</span>
            </div>
        </div>

        <nav className="flex items-center gap-6">
            <div className="flex flex-col">
                <span className="text-[9px] text-secondary uppercase tracking-widest font-bold">System Status</span>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_#10b981]" />
                    <span className="text-xs font-mono text-success uppercase">Active</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] text-secondary uppercase tracking-widest font-bold">Connectivity</span>
                <div className="flex items-center gap-2">
                    <Wifi size={12} className="text-secondary" />
                    <span className="text-xs font-mono text-secondary">LINK_ESTABLISHED</span>
                </div>
            </div>
        </nav>
      </div>

      <div className="flex items-center gap-8 relative z-10">
        <div className="flex items-center gap-6">
            <div className="text-right">
                <div className="text-[9px] text-secondary uppercase tracking-widest font-bold">Terminal Time</div>
                <div className="text-lg font-mono text-primary">{formatTime(time)}</div>
            </div>
            <div className="h-8 w-[1px] bg-border" />
            <div className="text-right">
                <div className="text-[9px] text-secondary uppercase tracking-widest font-bold">System Load</div>
                <div className="flex items-center gap-2 justify-end">
                    <Cpu size={12} className="text-primary" />
                    <span className="text-xs font-mono text-primary">02.4%</span>
                </div>
            </div>
        </div>
        
        <button className="p-2 border border-border rounded hover:bg-slate-900 transition-colors">
            <Settings size={18} className="text-secondary" />
        </button>
      </div>
    </header>
  );
};
