import { createClient } from '@supabase/supabase-js';

// Use environment variables from Vercel dashboard
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables. Please check your Vercel project settings.");
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Supabase-Client': 'React'
    }
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
