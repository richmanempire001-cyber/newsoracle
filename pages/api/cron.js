import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const topics = [
      "stock market movements and investor sentiment",
      "football transfer news and match results",
      "cryptocurrency market trends",
      "tennis tournament results and rankings",
      "Federal Reserve interest rate decisions",
      "Premier League latest news",
      "tech company earnings and stock performance",
      "NBA basketball scores and standings",
      "oil prices and energy markets",
      "boxing and MMA fight results"
    ];
    
    const topic = topics[Math.floor(Math.random() * topics.length)];

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Write a professional news article about ${topic}. 
        Write like a senior journalist at Bloomberg or Reuters.
        Use realistic figures, names, and market data.
        Do NOT mention AI, Claude, or predictions explicitly.
        Return ONLY a JSON object with NO extra text or markdown.
        Fields:
        - title: (compelling headline like Bloomberg, max 12 words)
        - summary: (3-4 sentences, professional journalism style, 100-150 words)
        - prediction: (market outlook or match prediction, written as analyst view, 50 words)
        - category: (either "finance" or "sports")
        - tag: (specific tag like "NFL", "S&P 500", "Premier League", "Crypto")
        - sentiment: (either "positive", "negative", or "neutral")
        - confidence: (number between 60-95)
        - disclaimer: ("This article is for informational purposes only and does not constitute financial or betting advice.")`
      }]
    });

    const text = message.content[0].text;
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const article = JSON.parse(clean);

    const { error } = await supabase.from('articles').insert([{
      title: article.title,
      summary: article.summary,
      prediction: article.prediction,
      category: article.category,
      tag: article.tag,
      sentiment: article.sentiment,
      confidence: article.confidence,
      disclaimer: article.disclaimer,
      pub_date: new Date().toISOString(),
      posted_at: new Date().toISOString()
    }]);

    if (error) throw error;

    return res.status(200).json({ success: true, article });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
