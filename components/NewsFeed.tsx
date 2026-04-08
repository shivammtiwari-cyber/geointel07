'use client';

import React from 'react';
import { NewsStory } from '../lib/news';
import { Shield, ShieldAlert, ShieldCheck, ExternalLink, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NewsFeedProps {
  stories: NewsStory[];
  loading: boolean;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ stories, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse p-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-slate-900/50 border border-slate-800 rounded flex items-center px-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs font-mono">
        <thead className="bg-slate-900 border-b border-border sticky top-0">
          <tr>
            <th className="p-3 text-secondary uppercase font-bold tracking-tighter">Status</th>
            <th className="p-3 text-secondary uppercase font-bold tracking-tighter">Event / Source</th>
            <th className="p-3 text-secondary uppercase font-bold tracking-tighter w-1/4">Region</th>
            <th className="p-3 text-secondary uppercase font-bold tracking-tighter">Confidence</th>
            <th className="p-3 text-secondary uppercase font-bold tracking-tighter">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {stories.map((story, i) => (
            <tr key={i} className="hover:bg-slate-900/30 transition-colors group">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  {story.intelligence.sentiment === 'Escalation' && (
                    <div className="w-6 h-6 rounded bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive animate-pulse">
                      <ShieldAlert size={14} />
                    </div>
                  )}
                  {story.intelligence.sentiment === 'De-escalation' && (
                    <div className="w-6 h-6 rounded bg-success/10 border border-success/30 flex items-center justify-center text-success">
                      <ShieldCheck size={14} />
                    </div>
                  )}
                  {story.intelligence.sentiment === 'Neutral' && (
                    <div className="w-6 h-6 rounded bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                      <Shield size={14} />
                    </div>
                  )}
                  <span className={cn(
                    "font-bold uppercase tracking-tight",
                    story.intelligence.sentiment === 'Escalation' && "text-destructive",
                    story.intelligence.sentiment === 'De-escalation' && "text-success",
                    story.intelligence.sentiment === 'Neutral' && "text-accent"
                  )}>
                    {story.intelligence.sentiment}
                  </span>
                </div>
              </td>
              <td className="p-3">
                <div>
                  <div className="text-foreground font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {story.title}
                  </div>
                  <div className="text-secondary/70 flex items-center gap-2">
                    <Activity size={10} className="text-primary" />
                    {story.source} 
                    <span className="text-[10px] opacity-50 px-2">|</span>
                    {new Date(story.publishedAt).toLocaleString()}
                  </div>
                </div>
              </td>
              <td className="p-3">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-border">
                  {story.region}
                </span>
              </td>
              <td className="p-3">
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${story.intelligence.confidence * 100}%` }}
                  />
                </div>
                <div className="mt-1 opacity-50 text-[10px] uppercase">
                  {(story.intelligence.confidence * 100).toFixed(0)}% Certainty
                </div>
              </td>
              <td className="p-3">
                <a 
                  href={story.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded border border-border hover:border-primary hover:text-primary transition-all flex items-center justify-center"
                >
                  <ExternalLink size={14} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
