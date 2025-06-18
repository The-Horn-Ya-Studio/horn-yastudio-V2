const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const NodeCache = require('node-cache');

const app = express();
const port = 4000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const cache = new NodeCache({ stdTTL: 10 }); // cache 10 detik

app.get('/api/members', async (req, res) => {
  const cached = cache.get('members');
  if (cached) return res.json(cached);

  const { data, error } = await supabase.from('members').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });

  cache.set('members', data);
  res.json(data);
});

app.get('/api/gallery', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 12;
  const cacheKey = `gallery-${page}-${pageSize}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from('gallery')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) return res.status(500).json({ error: error.message });

  const result = { items: data || [], totalCount: count || 0 };
  cache.set(cacheKey, result);
  res.json(result);
});

app.listen(port, () => console.log(`API running on port ${port}`));
