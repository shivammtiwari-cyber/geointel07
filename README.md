# Geopolitical Intelligence Dashboard

A production-ready "Command Center" dashboard built with Next.js 15, Tailwind CSS 4, and Framer Motion. This tool aggregates geopolitical news, performs automated sentiment analysis, and visualizes data on an interactive world map.

## 🚀 Deployment (Vercel)

The easiest way to deploy this dashboard is via the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the `NEWS_API_KEY` environment variable (see below).
4. Deploy!

## 🔐 Environment Variables

To enable real-time news aggregation, you must obtain an API Key from [NewsAPI.org](https://newsapi.org/).

| Variable | Description | Source |
| :--- | :--- | :--- |
| `NEWS_API_KEY` | Your NewsAPI Key | [newsapi.org](https://newsapi.org/register) |

> [!NOTE]
> If `NEWS_API_KEY` is not provided, the dashboard will run in **Mock Mode** with simulated intelligence data.

## 🛠 Features

- **Global Surveillance Map**: Interactive SVG world map with regional filtering.
- **Agentic Sentiment Sub-routine**: Automated tagging of news as *Escalation*, *De-escalation*, or *Neutral*.
- **Tactical UI**: High-density data tables, real-time scrolling ticker, and system status monitors.
- **Glassmorphism Design**: High-end dark mode aesthetic for decision-makers.

## 🏗 Tech Stack

- **Framework**: Next.js 15 (App Router / Turbopack)
- **Styling**: Tailwind CSS 4 (CSS-native variables)
- **Animation**: Framer Motion
- **Visualization**: React Simple Maps
- **Intelligence**: Custom Sentiment Routine (`lib/intelligence.ts`)
