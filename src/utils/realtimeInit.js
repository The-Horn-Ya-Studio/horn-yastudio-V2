import { supabaseClient } from '../supabase/client';

// Function to initialize realtime subscriptions from the frontend
export const initializeRealtime = async () => {
  try {
    // First, call the backend endpoint to initialize realtime connections
    await fetch('/api/realtime-init').catch(err => 
      console.warn('Could not reach backend realtime init endpoint:', err)
    );
    
    // Also set up direct frontend subscriptions as a backup/supplement
    const membersChannel = supabaseClient
      .channel('frontend-members')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'members' 
      }, (payload) => {
        console.log('Frontend received member change:', payload.eventType);
        // You could dispatch a Redux action or use context here to trigger a refresh
      })
      .subscribe();

    const galleryChannel = supabaseClient
      .channel('frontend-gallery')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'gallery' 
      }, (payload) => {
        console.log('Frontend received gallery change:', payload.eventType);
        // You could dispatch a Redux action or use context here to trigger a refresh
      })
      .subscribe();

    return { membersChannel, galleryChannel };
  } catch (error) {
    console.error('Error initializing realtime subscriptions:', error);
    return null;
  }
};
