'use client';

import React from 'react';
import { CyberLog } from '../lib/multidomain';
import { ShieldAlert, Terminal, Shield, RefreshCw } from 'lucide-react';

interface CyberFeedProps {
  logs: CyberLog[];
}

export const CyberFeed: React.FC<CyberFeedProps> = ({ logs }) => {
  const getSeverityColor = (sev: CyberLog['severity']) => {
    switch (sev) {
      case 'CRITICAL': return 'text-red-500 bg-red-950/40 border-red-500/30';
      case 'HIGH': return 'text-orange-400 bg-orange-950/40 border-orange-500/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-950/40 border-yellow-500/30';
      case 'LOW': return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
      default: return 'text-secondary bg-slate-950';
    }
  };

  const getStatusColor = (status: CyberLog['status']) => {
    switch (status) {
      case 'BLOCKED': return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
      case 'QUARANTINED': return 'text-orange-400 border-orange-500/20 bg-orange-950/20';
      case 'INVESTIGATING': return 'text-yellow-400 border-yellow-500/20 bg-yellow-950/20 animate-pulse';
      case 'MITIGATED': return 'text-slate-400 border-slate-500/20 bg-slate-950/20';
      default: return 'text-secondary border-border bg-slate-950/10';
    }
  };

  // Simple stats calculation
  const criticalCount = logs.filter(l => l.severity === 'CRITICAL').length;
  const attackSuccessRate = 0; // Everything is blocked or mitigated in a secure network!

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/40 h-full font-mono text-xs">
      {/* Active Stream Panel */}
      <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
        <div className="px-4 py-2 border-b border-border/40 bg-slate-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Tactical Security Log</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-secondary">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            LIVE FEED ACTIVE
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/20 max-h-[280px]">
          {logs.map((log) => (
            <div key={log.id} className="p-3 hover:bg-slate-900/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getSeverityColor(log.severity)}`}>
                  {log.severity}
                </span>
                <div>
                  <div className="text-foreground font-semibold flex items-center gap-1.5">
                    {log.vector}
                    <span className="text-secondary/50 font-normal">→</span>
                    <span className="text-cyan-400">{log.targetNode}</span>
                  </div>
                  <div className="text-secondary/70 text-[10px] mt-0.5">
                    Source IP: <span className="text-foreground">{log.sourceIp}</span>
                    <span className="mx-2">|</span>
                    ID: {log.id}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end md:self-auto">
                <span className="text-[10px] text-secondary/50">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${getStatusColor(log.status)}`}>
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cyber Status Dashboard */}
      <div className="p-4 bg-slate-950/20 flex flex-col justify-between gap-4 h-full shrink-0">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase text-secondary tracking-widest">Network Threat Index</span>
            <span className="px-2 py-0.5 rounded bg-orange-950/50 text-orange-400 border border-orange-500/20 text-[9px] font-bold">
              DEFCON 3
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-900/60 border border-border/40 p-2.5 rounded">
              <div className="text-secondary text-[9px] uppercase">Firewall Blocks</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">100%</div>
            </div>
            <div className="bg-slate-900/60 border border-border/40 p-2.5 rounded">
              <div className="text-secondary text-[9px] uppercase">Critical Alerts</div>
              <div className="text-lg font-bold text-red-500 mt-1">{criticalCount}</div>
            </div>
          </div>

          {/* Nodes grid */}
          <div className="space-y-2">
            <span className="text-[9px] text-secondary uppercase font-bold tracking-wider">Node Status Overview</span>
            <div className="grid grid-cols-4 gap-1.5">
              {['FW_01', 'DB_01', 'UPLINK', 'VAULT', 'PROXY', 'ROUTER', 'GRID', 'RECON'].map((node, i) => {
                const isDown = i === 2; // Simulated minor degradation
                return (
                  <div 
                    key={node} 
                    className={`p-1 border rounded text-center text-[8px] font-bold transition-all ${
                      isDown 
                        ? 'border-yellow-500/30 bg-yellow-950/20 text-yellow-400' 
                        : 'border-emerald-500/30 bg-emerald-950/10 text-emerald-400'
                    }`}
                  >
                    <div>{node}</div>
                    <div className="h-1 w-1 rounded-full mx-auto mt-1 bg-current" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-cyan-950/10 border border-cyan-500/20 p-3 rounded-lg flex gap-2.5 items-start">
          <Shield size={14} className="text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-[9px] text-cyan-400 font-bold uppercase">IPS Safeguard Active</div>
            <p className="text-[9px] text-secondary leading-tight">
              Intrusion Prevention System is shielding active subnets. Neural routing anomaly checks are standard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
