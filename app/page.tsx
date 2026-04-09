'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '../components/Header';
import { Ticker } from '../components/Ticker';
import { NewsFeed } from '../components/NewsFeed';
import { RedlineMonitor } from '../components/RedlineMonitor';
import { fetchNews, NewsStory, calculateRegionalIntensity } from '../lib/news';
import { Globe, Shield, Zap, Info, ShieldAlert } from 'lucide-react';

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

  const tickerItems = [
    "UN Security Council meeting scheduled for 0900Z regarding maritime dispute",
    "Global crude futures surge 2.4% following supply chain disruptions in Hormuz",
    "Diplomatic breakthrough reported in Alpine borders; ceasefire extended",
    "Intelligence alert: Increased cyber activity detected from Eastern sector"
  ];

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
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-6 flex flex-col gap-6 relative">
            <div className="flex-1 min-h-[400px]">
              <WorldMap onSelectCountry={setSelectedRegion} intensities={intensities} />
            </div>
            
            <div className="h-1/3 glass rounded-lg flex flex-col overflow-hidden">
              <div className="px-4 py-2 border-b border-border bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="text-primary" size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Signal Feed</span>
                </div>
                {selectedRegion && (
                    <button 
                        onClick={() => setSelectedRegion(null)}
                        className="text-[10px] text-primary hover:underline"
                    >
                        RESET_FILTER
                    </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                <NewsFeed stories={news} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Ticker */}
      <Ticker items={tickerItems} />
    </main>
  );
}


