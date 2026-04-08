export type Sentiment = 'Escalation' | 'De-escalation' | 'Neutral';

export interface NewsIntelligence {
  sentiment: Sentiment;
  confidence: number;
  reasoning: string;
}

const ESCALATION_KEYWORDS = [
  'strike', 'conflict', 'sanctions', 'dispute', 'warning', 'clash', 'offensive', 
  'threat', 'military', 'war', 'missile', 'invasion', 'retaliation', 'tension'
];

const DEESCALATION_KEYWORDS = [
  'peace', 'treaty', 'negotiation', 'talks', 'ceasefire', 'diplomacy', 'agreement', 
  'withdrawal', 'resolve', 'humanitarian', 'cooperation', 'dialogue'
];

/**
 * Agentic sub-routine for news sentiment analysis.
 * Simulates an intelligence agent processing reports.
 */
export function analyzeSentiment(title: string, description: string): NewsIntelligence {
  const content = (title + ' ' + (description || '')).toLowerCase();
  
  let escalationScore = 0;
  let deescalationScore = 0;

  ESCALATION_KEYWORDS.forEach(keyword => {
    if (content.includes(keyword)) escalationScore++;
  });

  DEESCALATION_KEYWORDS.forEach(keyword => {
    if (content.includes(keyword)) deescalationScore++;
  });

  if (escalationScore > deescalationScore) {
    return {
      sentiment: 'Escalation',
      confidence: Math.min(0.5 + (escalationScore * 0.1), 0.95),
      reasoning: `Detected escalation triggers: ${ESCALATION_KEYWORDS.filter(k => content.includes(k)).join(', ')}`
    };
  }

  if (deescalationScore > escalationScore) {
    return {
      sentiment: 'De-escalation',
      confidence: Math.min(0.5 + (deescalationScore * 0.1), 0.95),
      reasoning: `Detected de-escalation triggers: ${DEESCALATION_KEYWORDS.filter(k => content.includes(k)).join(', ')}`
    };
  }

  return {
    sentiment: 'Neutral',
    confidence: 1.0,
    reasoning: 'Standard geopolitical reporting without strong directional triggers.'
  };
}
