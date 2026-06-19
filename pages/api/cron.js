import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: 'Write a short sports or finance news article with a prediction. Return JSON only with fields: title, summary, prediction, category (sports or finance), tag, sentiment (positive/negative/neutral), confidence (1-100), disclaimer.'
      }]
    });

    const text = message.content[0].text;
    const article = JSON.parse(text);

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
