import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const { data: article } = await supabase
    .from('articles')
    .select('views')
    .eq('id', id)
    .single();

  if (!article) return res.status(404).json({ error: 'Not found' });

  await supabase
    .from('articles')
    .update({ views: (article.views || 0) + 1 })
    .eq('id', id);

  return res.status(200).json({ success: true });
}
