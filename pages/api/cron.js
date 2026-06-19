import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

function getImageUrl(keyword) {
  return `https://source.unsplash.com/800x500/?${encodeURIComponent(keyword)}`;
}

async function generateArticle(topic, category) {
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
      - category: ("${category}")
      - tag: (specific tag like "NFL", "S&P 500", "Premier League", "Crypto", "Tesla", "NBA")
      - image_keyword: (2-3 words perfect for finding a relevant image, e.g. "tesla car", "football stadium", "stock market", "basketball court")
      - sentiment: (either "positive", "negative", or "neutral")
      - confidence: (number between 60-95)
      - disclaimer: ("This article is for informational purposes only and does not constitute financial or betting advice.")`
    }]
  });

  const text = message.content[0].text;
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(clean);
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const financeTopics = [
      "stock market movements and investor sentiment",
      "cryptocurrency market trends and Bitcoin price",
      "Federal Reserve interest rate decisions",
      "tech company earnings and stock performance",
      "oil prices and energy markets",
      "gold and commodity markets",
      "S&P 500 and Nasdaq performance",
      "inflation data and economic outlook"
    ];

    const sportsTopics = [
      "football transfer news and match results",
      "tennis tournament results and rankings",
      "NBA basketball scores and standings",
      "boxing and MMA fight results",
      "Premier League latest news",
      "NFL American football news",
      "cricket match results and rankings",
      "Formula 1 racing news and standings"
    ];

    const financeTopic = financeTopics[Math.floor(Math.random() * financeTopics.length)];
    const sportsTopic = sportsTopics[Math.floor(Math.random() * sportsTopics.length)];

    const [financeArticle, sportsArticle] = await Promise.all([
      generateArticle(financeTopic, 'finance'),
      generateArticle(sportsTopic, 'sports')
    ]);

    const articles = [
      {
        ...financeArticle,
        image: getImageUrl(financeArticle.image_keyword),
        pub_date: new Date().toISOString(),
        posted_at: new Date().toISOString()
      },
      {
        ...sportsArticle,
        image: getImageUrl(sportsArticle.image_keyword),
        pub_date: new Date().toISOString(),
        posted_at: new Date().toISOString()
      }
    ];

    const { error } = await supabase.from('articles').insert(
      articles.map(a => ({
        title: a.title,
        summary: a.summary,
        prediction: a.prediction,
        category: a.category,
        tag: a.tag,
        image: a.image,
        sentiment: a.sentiment,
        confidence: a.confidence,
        disclaimer: a.disclaimer,
        pub_date: a.pub_date,
        posted_at: a.posted_at
      }))
    );

    if (error) throw error;

    return res.status(200).json({ success: true, articles });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
