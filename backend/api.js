const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const NodeCache = require('node-cache');

// Setup for both local development and Vercel deployment
const app = express();
const cache = new NodeCache({ stdTTL: 10 }); // cache 10 detik

// Use environment variables securely
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Enable CORS for Vercel deployment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Clear cache when data changes to ensure real-time updates
const clearCache = (tableName) => {
  if (tableName === 'members') {
    cache.del('members');
  } else if (tableName === 'gallery') {
    // Clear all gallery cache entries (different pages)
    const keys = cache.keys();
    keys.forEach(key => {
      if (key.startsWith('gallery-')) {
        cache.del(key);
      }
    });
  }
};

// Setup Supabase realtime subscriptions once at server start
const setupRealtimeSubscriptions = async () => {
  try {
    // Listen for changes to the members table
    const membersChannel = supabase
      .channel('db-changes-members')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'members' 
      }, (payload) => {
        console.log('Members table changed:', payload.eventType);
        clearCache('members');
      })
      .subscribe();

    // Listen for changes to the gallery table
    const galleryChannel = supabase
      .channel('db-changes-gallery')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'gallery' 
      }, (payload) => {
        console.log('Gallery table changed:', payload.eventType);
        clearCache('gallery');
      })
      .subscribe();
      
    console.log('Realtime subscriptions set up successfully');
  } catch (error) {
    console.error('Error setting up realtime subscriptions:', error);
  }
};

// Set up realtime subscriptions in non-serverless environments
if (process.env.NODE_ENV !== 'production') {
  setupRealtimeSubscriptions();
}

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

// New endpoint to initialize realtime and get fresh data
app.get('/api/realtime-init', async (req, res) => {
  try {
    // For serverless environment, we set up subscriptions on demand
    if (process.env.NODE_ENV === 'production') {
      await setupRealtimeSubscriptions();
    }
    
    // Clear all caches to ensure fresh data
    cache.flushAll();
    
    res.json({ success: true, message: 'Realtime connections initialized' });
  } catch (error) {
    console.error('Realtime initialization error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API running on port ${port}`));
}

// Export for Vercel serverless functions
module.exports = app;
