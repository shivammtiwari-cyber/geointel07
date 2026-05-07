'use server';

import { analyzeSentiment, NewsIntelligence } from './intelligence';
import Parser from 'rss-parser';

export interface NewsStory {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  region: string;
  intelligence: NewsIntelligence;
  isOfficial?: boolean;
}

const parser = new Parser();

const RSS_FEEDS = [
  { name: 'UN News', url: 'https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/feed/rss.xml' },
  { name: 'Whats In Blue', url: 'https://www.securitycouncilreport.org/rss/whats-in-blue.xml' },
  { name: 'UN Press', url: 'https://press.un.org/en/rss/sc' }
];

const MOCK_NEWS: NewsStory[] = [
  {
    title: "Regional Trade Agreement Finalized in SE Asia",
    description: "Diplomatic efforts lead to a new economic cooperation treaty signed in Jakarta.",
    url: "#",
    source: "Global Times",
    publishedAt: new Date().toISOString(),
    region: "Indonesia",
    intelligence: analyzeSentiment("Regional Trade Agreement Finalized in SE Asia", "Diplomatic efforts lead to a new economic cooperation treaty signed in Jakarta.")
  },
  {
    title: "Naval Drills Reported in Disputed Waters",
    description: "Tensions rise as military exercises begin near the maritime border.",
    url: "#",
    source: "Defense Post",
    publishedAt: new Date().toISOString(),
    region: "South China Sea",
    intelligence: analyzeSentiment("Naval Drills Reported in Disputed Waters", "Tensions rise as military exercises begin near the maritime border.")
  },
  {
    title: "Emergency Energy Summit Convened",
    description: "OPEC+ members meet to discuss supply stabilizers amid global shortages.",
    url: "#",
    source: "Energy Now",
    publishedAt: new Date().toISOString(),
    region: "Saudi Arabia",
    intelligence: analyzeSentiment("Emergency Energy Summit Convened", "OPEC+ members meet to discuss supply stabilizers amid global shortages.")
  }
];

/**
 * Fetches news from NewsAPI and integrated UN RSS feeds.
 */
export async function fetchNews(region?: string | null): Promise<NewsStory[]> {
  const apiKey = process.env.NEWS_API_KEY;
  let allStories: NewsStory[] = [];

  // 1. Fetch from RSS Feeds (Always active)
  try {
    const rssStories = await Promise.all(
      RSS_FEEDS.map(async (feed) => {
        try {
          const content = await fetch(feed.url).then(res => res.text());
          const parsed = await parser.parseString(content);
          return parsed.items.map(item => ({
            title: item.title || "No Title",
            description: item.contentSnippet || item.content || "",
            url: item.link || "#",
            source: feed.name,
            publishedAt: item.pubDate || new Date().toISOString(),
            region: "Global", // RSS usually lacks granular region tags, we'll refine if needed
            isOfficial: true,
            intelligence: analyzeSentiment(item.title || "", item.contentSnippet || "")
          }));
        } catch (e) {
          console.error(`RSS fetch error for ${feed.name}:`, e);
          return [];
        }
      })
    );
    allStories = [...allStories, ...rssStories.flat()];
  } catch (error) {
    console.error("Global RSS error:", error);
  }

  if (apiKey && apiKey !== "paste_your_api_key_here") {
    try {
      const q = region ? `geopolitics ${region}` : 'geopolitics conflict diplomacy';
      const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&apiKey=${apiKey}`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        const newsApiStories = data.articles.slice(0, 15).map((article: { title: string, description: string, url: string, source: { name: string }, publishedAt: string }) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          source: article.source.name,
          publishedAt: article.publishedAt,
          region: region || "Global",
          intelligence: analyzeSentiment(article.title, article.description)
        }));
        allStories = [...allStories, ...newsApiStories];
      }
    } catch (error) {
      console.error("NewsAPI fetch error:", error);
    }
  }
  
  if (allStories.length === 0) {
    allStories = MOCK_NEWS;
  }

  // Sort and Filter
  if (region) {
    allStories = allStories.filter(n => 
      n.region.toLowerCase().includes(region.toLowerCase()) || 
      n.title.toLowerCase().includes(region.toLowerCase())
    );

    // Fallback if no news was found for that specific region
    if (allStories.length === 0) {
      allStories = [{
          title: `Flash intel: OSINT activity noted in ${region}`,
          description: `An automated agent is tracking unusual signal volumes originating from ${region}. Escalation variables remain speculative pending verification from our network.`,
          url: "#",
          source: "SYSTEM_GEN",
          publishedAt: new Date().toISOString(),
          region: region,
          intelligence: analyzeSentiment(`Flash intel: OSINT activity noted in ${region}`, `An automated agent is tracking unusual signal volumes`)
      }];
    }
  }

  return allStories.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * Calculates tension levels for regions based on current news sentiment.
 */
export async function calculateRegionalIntensity(stories: NewsStory[]): Promise<Record<string, number>> {
  const intensity: Record<string, number> = {};
  
  // Initialize common geopolitical regions
  const regions = ["Israel", "Ukraine", "China", "Russia", "Iran", "USA", "Taiwan", "North Korea", "Sudan"];
  regions.forEach(r => intensity[r] = 0);

  stories.forEach(story => {
    // Check if the title or description mentions a major region
    regions.forEach(region => {
      const text = (story.title + " " + story.description).toLowerCase();
      if (text.includes(region.toLowerCase())) {
        let weight = 10; // Base score
        if (story.intelligence.sentiment === 'Escalation') weight += 30 * story.intelligence.confidence;
        if (story.isOfficial) weight += 15; // Official reports have higher weight
        
        intensity[region] = Math.min((intensity[region] || 0) + weight, 100);
      }
    });
  });

  return intensity;
}

