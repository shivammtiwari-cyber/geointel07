'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TickerProps {
  items: string[];
}

export const Ticker: React.FC<TickerProps> = ({ items }) => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="w-full h-10 bg-slate-900/50 border-y border-border" />;

  const currentTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full overflow-hidden bg-slate-900/50 border-y border-border py-2 flex items-center">
      <div className="bg-primary text-background px-3 py-0.5 text-xs font-bold uppercase tracking-widest mr-4 z-10">
        Live Updates
      </div>
      <motion.div
        className="flex whitespace-nowrap gap-12"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 text-sm font-mono text-cyan-400">
            <span className="text-secondary opacity-50">[{currentTime}]</span>
            {item}
            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
          </div>
        ))}
        {/* Duplicate for seamless infinite loop */}
        {items.map((item, index) => (
          <div key={`dup-${index}`} className="flex items-center gap-4 text-sm font-mono text-cyan-400">
            <span className="text-secondary opacity-50">[{currentTime}]</span>
            {item}
            <span className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
