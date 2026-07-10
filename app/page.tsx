'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '../components/Header';
import { Ticker } from '../components/Ticker';
import { NewsFeed } from '../components/NewsFeed';
import { CyberFeed } from '../components/CyberFeed';
import { SpaceFeed } from '../components/SpaceFeed';
import { RedlineMonitor } from '../components/RedlineMonitor';
import { fetchNews, NewsStory, calculateRegionalIntensity } from '../lib/news';
import { audioAlerts } from '../lib/audio';
import { 
  generateInitialCyberLogs, 
  generateCyberLog, 
  updateSatelliteTelemetry, 
  SatelliteTelemetry, 
  CyberLog, 
  SpaceWeather, 
  INITIAL_SATELLITES, 
  MOCK_SPACE_WEATHER 
} from '../lib/multidomain';
import { Globe, Shield, Zap, Info, ShieldAlert, Terminal, Radio } from 'lucide-react';

const WorldMap = dynamic(() => import('../components/WorldMap').then(mod => mod.WorldMap), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-950/20 rounded-lg border border-border/50 animate-pulse flex items-center justify-center text-primary/50 text-xs font-mono">
            ESTABLISHING SECURE SATELLITE UPLINK...
        </div>
    )
});

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [news, setNews] = useState<NewsStory[]>([]);
  const [intensities, setIntensities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Multi-Domain Operations Feed States
  const [activeTab, setActiveTab] = useState<'geopolitical' | 'cyber' | 'space'>('geopolitical');
  const [cyberLogs, setCyberLogs] = useState<CyberLog[]>([]);
  const [satellites, setSatellites] = useState<SatelliteTelemetry[]>(INITIAL_SATELLITES);
  const [spaceWeather, setSpaceWeather] = useState<SpaceWeather>(MOCK_SPACE_WEATHER);

  const getDynamicTickerItems = () => {
    if (activeTab === 'cyber') {
      if (cyberLogs.length === 0) return ["NO ACTIVE CYBER INCIDENTS DETECTED"];
      return cyberLogs.slice(0, 8).map(log => {
        const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return `[${timeStr}] CYBER ALERT: ${log.vector} targeting ${log.targetNode} status is ${log.status} (SEVERITY: ${log.severity})`;
      });
    }

    if (activeTab === 'space') {
      const weatherStr = `[SPACE WEATHER] Solar Flare: ${spaceWeather.solarFlareLevel} | Geomagnetic: ${spaceWeather.geomagneticIndex} | Radiation Belt: ${spaceWeather.radiationBelt}`;
      const satStrs = satellites.map(sat => {
        return `[TELEMETRY] ${sat.name} orbital uplink at ${sat.uplinkStrength}% power status is ${sat.status}`;
      });
      return [weatherStr, ...satStrs];
    }

    // Geopolitical (Default)
    if (news.length === 0) {
      return [
        "UN Security Council meeting scheduled for 0900Z regarding maritime dispute",
        "Global crude futures surge 2.4% following supply chain disruptions in Hormuz",
        "Diplomatic breakthrough reported in Alpine borders; ceasefire extended",
        "Intelligence alert: Increased cyber activity detected from Eastern sector"
      ];
    }
    return news.map(story => {
      const timeStr = new Date(story.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `[${timeStr}] ${story.region.toUpperCase()}: ${story.title}`;
    });
  };

  useEffect(() => {
    setCyberLogs(generateInitialCyberLogs(8));
  }, []);

  useEffect(() => {
    // 1. Cyber Stream simulation
    const cyberTimer = setInterval(() => {
      setCyberLogs(prev => {
        const newLog = generateCyberLog();
        if (activeTab === 'cyber') {
          audioAlerts?.playUpdateBlip();
        }
        return [newLog, ...prev.slice(0, 19)];
      });
    }, 6000);

    // 2. Satellite telemetry simulation
    const satTimer = setInterval(() => {
      setSatellites(prev => {
        const updated = updateSatelliteTelemetry(prev);
        if (activeTab === 'space') {
          audioAlerts?.playUpdateBlip();
        }
        return updated;
      });
    }, 4000);

    // 3. Space Weather fluctuation
    const weatherTimer = setInterval(() => {
      if (Math.random() > 0.85) {
        const flareLevels: SpaceWeather['solarFlareLevel'][] = ['QUIET', 'MODERATE', 'ACTIVE', 'SEVERE'];
        const randomFlare = flareLevels[Math.floor(Math.random() * flareLevels.length)];
        setSpaceWeather(prev => ({
          ...prev,
          solarFlareLevel: randomFlare,
          geomagneticIndex: randomFlare === 'SEVERE' ? 'Kp-6' : randomFlare === 'ACTIVE' ? 'Kp-5' : 'Kp-3'
        }));
      }
    }, 15000);

    return () => {
      clearInterval(cyberTimer);
      clearInterval(satTimer);
      clearInterval(weatherTimer);
    };
  }, [activeTab]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchNews(selectedRegion);
      setNews(data);
      
      // Calculate intensity based on ALL current global news, not just filtered
      const globalNews = await fetchNews(null);
      setIntensities(await calculateRegionalIntensity(globalNews));
      
      setLoading(false);
    }
    loadData();
  }, [selectedRegion]);

  return (
    <main className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Dynamic Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Regional Intel */}
        <aside className="w-80 border-r border-border bg-slate-900/40 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Globe size={18} />
              <h2 className="text-sm font-bold uppercase tracking-wider">Sector Overview</h2>
            </div>
            <div className="bg-slate-950 p-4 rounded border border-border/50">
              <div className="text-[10px] text-secondary uppercase mb-1">Active Region</div>
              <div className="text-lg font-mono text-cyan-400 truncate">
                {selectedRegion || "GLOBAL_SCOPE"}
              </div>
            </div>
          </div>

          {/* Redline Monitor Integration */}
          <RedlineMonitor intensities={intensities} />

          <div className="mt-auto">
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <Zap size={16} />
                    <span className="text-xs font-bold uppercase">System Note</span>
                </div>
                <p className="text-[11px] text-secondary leading-relaxed">
                    Intelligence routine ID-774 is currently processing real-time signals. All sentiment confidence levels are within nominal range.
                </p>
            </div>
          </div>
        </aside>

        {/* Tactical Display Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="flex-1 p-6 flex flex-col gap-6 relative">
            <div className="flex-none h-[400px] lg:flex-1">
              <WorldMap onSelectCountry={setSelectedRegion} intensities={intensities} />
            </div>
            
            <div className="min-h-[250px] flex-shrink-0 glass rounded-lg flex flex-col overflow-hidden">
              {/* Tactical Tabs Header */}
              <div className="px-4 py-1.5 border-b border-border bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1">
                  {/* Tab 1: Geopolitical */}
                  <button
                    onClick={() => {
                      setActiveTab('geopolitical');
                      audioAlerts?.playUpdateBlip();
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest font-mono flex items-center gap-2 border transition-all cursor-pointer ${
                      activeTab === 'geopolitical'
                        ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                        : 'border-transparent text-secondary hover:text-foreground'
                    }`}
                  >
                    <ShieldAlert size={12} />
                    Geopolitical Signals
                  </button>

                  {/* Tab 2: Cyber */}
                  <button
                    onClick={() => {
                      setActiveTab('cyber');
                      audioAlerts?.playUpdateBlip();
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest font-mono flex items-center gap-2 border transition-all cursor-pointer ${
                      activeTab === 'cyber'
                        ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                        : 'border-transparent text-secondary hover:text-foreground'
                    }`}
                  >
                    <Terminal size={12} />
                    Cyber Surveillance
                  </button>

                  {/* Tab 3: Space */}
                  <button
                    onClick={() => {
                      setActiveTab('space');
                      audioAlerts?.playUpdateBlip();
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest font-mono flex items-center gap-2 border transition-all cursor-pointer ${
                      activeTab === 'space'
                        ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                        : 'border-transparent text-secondary hover:text-foreground'
                    }`}
                  >
                    <Radio size={12} />
                    Space Operations
                  </button>
                </div>

                {/* Filters / Region Reset */}
                <div className="flex items-center gap-4">
                  {selectedRegion && activeTab === 'geopolitical' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-cyan-400 font-mono">FILTER: {selectedRegion.toUpperCase()}</span>
                      <button 
                        onClick={() => setSelectedRegion(null)}
                        className="text-[9px] text-primary font-mono hover:underline border border-primary/20 px-1.5 py-0.5 rounded bg-primary/5 cursor-pointer"
                      >
                        RESET
                      </button>
                    </div>
                  )}
                  {selectedRegion && activeTab !== 'geopolitical' && (
                    <span className="text-[9px] text-secondary/60 font-mono italic">Global Matrix View</span>
                  )}
                </div>
              </div>

              {/* Feed Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'geopolitical' && (
                  <NewsFeed stories={news} loading={loading} />
                )}
                {activeTab === 'cyber' && (
                  <CyberFeed logs={cyberLogs} />
                )}
                {activeTab === 'space' && (
                  <SpaceFeed satellites={satellites} spaceWeather={spaceWeather} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Ticker */}
      <Ticker items={getDynamicTickerItems()} />
    </main>
  );
}


