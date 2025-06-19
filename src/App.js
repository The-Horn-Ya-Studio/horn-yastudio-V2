import React, { useEffect } from 'react';
import { initializeRealtime } from './utils/realtimeInit';
// ... other imports

function App() {
  useEffect(() => {
    // Initialize realtime connections when the app loads
    let channels = null;
    
    const setupRealtime = async () => {
      channels = await initializeRealtime();
      console.log('Realtime connections initialized');
    };
    
    setupRealtime();
    
    // Cleanup function to remove channels when component unmounts
    return () => {
      if (channels) {
        const { membersChannel, galleryChannel } = channels;
        if (membersChannel) supabaseClient.removeChannel(membersChannel);
        if (galleryChannel) supabaseClient.removeChannel(galleryChannel);
      }
    };
  }, []);

  // ... existing component code
}

export default App;
