import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef, useState } from 'react';
import { Member, Photo } from '../types';
import { supabaseClient } from '../supabase/client';

const STORAGE_MODE = process.env.REACT_APP_STORAGE_MODE || 'local';
const LOCAL_API_URL = process.env.REACT_APP_LOCAL_API_URL || 'http://localhost:4000/api/data';

console.log("STORAGE_MODE:", STORAGE_MODE);
console.log("LOCAL_API_URL:", LOCAL_API_URL);

interface AppState {
  members: Member[];
  photos: Photo[];
  isLoading?: boolean;
  error?: string | null;
}

type AppAction = 
  | { type: 'SET_MEMBERS'; payload: Member[] }
  | { type: 'SET_PHOTOS'; payload: Photo[] }
  | { type: 'ADD_MEMBER'; payload: Member }
  | { type: 'UPDATE_MEMBER'; payload: Member }
  | { type: 'DELETE_MEMBER'; payload: string }
  | { type: 'ADD_PHOTO'; payload: Photo }
  | { type: 'DELETE_PHOTO'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIAL_DATA'; payload: AppState };

const initialState: AppState = {
  members: [],
  photos: [],
  isLoading: false,
  error: null
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  refreshData?: () => Promise<void>;
} | null>(null);

const appReducer = (state: AppState, action: AppAction): AppState => {
  let newState;
  switch (action.type) {
    case 'SET_MEMBERS':
      newState = { ...state, members: action.payload };
      break;
    case 'SET_PHOTOS':
      newState = { ...state, photos: action.payload };
      break;
    case 'ADD_MEMBER':
      newState = { ...state, members: [...state.members, action.payload] };
      break;
    case 'UPDATE_MEMBER':
      newState = {
        ...state,
        members: state.members.map(m => m.id === action.payload.id ? action.payload : m)
      };
      break;
    case 'DELETE_MEMBER':
      newState = {
        ...state,
        members: state.members.filter(m => m.id !== action.payload)
      };
      break;
    case 'ADD_PHOTO':
      newState = { ...state, photos: [...state.photos, action.payload] };
      break;
    case 'DELETE_PHOTO':
      newState = {
        ...state,
        photos: state.photos.filter(p => p.id !== action.payload)
      };
      break;
    case 'SET_LOADING':
      newState = { ...state, isLoading: action.payload };
      break;
    case 'SET_ERROR':
      newState = { ...state, error: action.payload };
      break;
    case 'SET_INITIAL_DATA':
      newState = action.payload;
      break;
    default:
      return state;
  }
  return newState;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [subscribed, setSubscribed] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);
  const membersChannelRef = useRef<any>(null);
  const photosChannelRef = useRef<any>(null);

  // --- LOCAL VM STORAGE MODE (via backend API) ---
  useEffect(() => {
    if (STORAGE_MODE === 'local') {
      let isMounted = true;
      const fetchData = async () => {
        if (!isMounted) return;
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          const res = await fetch(LOCAL_API_URL);
          const data = await res.json();
          if (isMounted) dispatch({ type: 'SET_INITIAL_DATA', payload: data });
        } catch (error) {
          if (isMounted) dispatch({ type: 'SET_ERROR', payload: 'Failed to load data from local VM' });
        } finally {
          if (isMounted) dispatch({ type: 'SET_LOADING', payload: false });
        }
      };
      fetchData();
      return () => { isMounted = false; };
    }
  }, []);

  // --- SUPABASE MODE: Single function for both initial fetch & subscription ---
  useEffect(() => {
    if (STORAGE_MODE !== 'supabase') return;
    
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout | null = null;
    
    const fetchData = async () => {
      if (!isMounted) return;
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        console.log('Fetching data from Supabase...');
        // Simple sequential fetching (avoiding potential race conditions)
        const membersResult = await supabaseClient.from('members').select('*');
        const photosResult = await supabaseClient.from('photos').select('*');
        
        if (!isMounted) return;
        
        // Process results
        const membersData = membersResult.data || [];
        const photosData = photosResult.data || [];
        
        console.log(`Loaded ${membersData.length} members and ${photosData.length} photos`);
        
        // Update state
        dispatch({ type: 'SET_MEMBERS', payload: membersData });
        dispatch({ type: 'SET_PHOTOS', payload: photosData });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
        }
      } finally {
        if (isMounted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };
    
    // Fetch data immediately
    fetchData();
    
    // Only set up subscription if not already subscribed
    if (!subscribed && connectionRetries < 3) {
      const setupRealtimeSubscription = async () => {
        if (!isMounted || subscribed) return;
        
        try {
          console.log('Attempting to set up Supabase realtime subscription...');
          
          // Clean up any existing channels first
          if (membersChannelRef.current) {
            await supabaseClient.removeChannel(membersChannelRef.current);
            membersChannelRef.current = null;
          }
          
          if (photosChannelRef.current) {
            await supabaseClient.removeChannel(photosChannelRef.current);
            photosChannelRef.current = null;
          }
          
          // Create new unique channels
          const channel = supabaseClient.channel('custom-all-channel');
          
          // Set up listeners
          channel
            .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, 
              () => { if (isMounted) fetchData(); })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, 
              () => { if (isMounted) fetchData(); });
          
          // Subscribe just once
          await channel.subscribe((status) => {
            console.log(`Realtime subscription status: ${status}`);
            
            if (status === 'SUBSCRIBED' && isMounted) {
              membersChannelRef.current = channel;
              photosChannelRef.current = channel;
              setSubscribed(true);
              setConnectionRetries(0);
              console.log('Successfully subscribed to realtime changes');
            }
          });
        } catch (error) {
          console.error('Subscription error:', error);
          
          if (isMounted && connectionRetries < 2) {
            setConnectionRetries(prev => prev + 1);
            console.log(`Realtime subscription failed, retry ${connectionRetries + 1}/3 in 10 seconds...`);
            
            // Clear any existing timeout
            if (retryTimeout) clearTimeout(retryTimeout);
            
            // Set up retry with increasing backoff
            retryTimeout = setTimeout(setupRealtimeSubscription, 10000);
          }
        }
      };
      
      // Start subscription process after a short delay
      setTimeout(setupRealtimeSubscription, 2000);
    }
    
    return () => {
      console.log('Cleaning up Supabase context...');
      isMounted = false;
      
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      
      // Clean up channels
      const cleanupChannels = async () => {
        if (membersChannelRef.current) {
          try {
            await supabaseClient.removeChannel(membersChannelRef.current);
          } catch (e) {
            console.error('Error removing channel:', e);
          }
          membersChannelRef.current = null;
        }
      };
      
      cleanupChannels();
    };
  }, [subscribed, connectionRetries]);
  
  const dispatchWithSync = async (action: AppAction) => {
    let nextState = appReducer(state, action);
    dispatch(action);

    if (STORAGE_MODE === 'local') {
      await fetch(LOCAL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members: nextState.members,
          photos: nextState.photos
        })
      });
    } else if (STORAGE_MODE === 'supabase') {
      try {
        if (action.type === 'ADD_MEMBER') {
          const { error } = await supabaseClient.from('members').insert(action.payload);
          if (error) throw error;
        } else if (action.type === 'UPDATE_MEMBER') {
          const { error } = await supabaseClient.from('members').update(action.payload).eq('id', action.payload.id);
          if (error) throw error;
        } else if (action.type === 'DELETE_MEMBER') {
          const { error } = await supabaseClient.from('members').delete().eq('id', action.payload);
          if (error) throw error;
        } else if (action.type === 'ADD_PHOTO') {
          const { error } = await supabaseClient.from('photos').insert(action.payload);
          if (error) throw error;
        } else if (action.type === 'DELETE_PHOTO') {
          const { error } = await supabaseClient.from('photos').delete().eq('id', action.payload);
          if (error) throw error;
        }
        // Tidak perlu refreshData karena realtime akan otomatis update
      } catch (error) {
        console.error("Supabase error:", error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save data to Supabase' });
      }
    }
  };

  // refreshData function
  const refreshData = async () => {
    if (!state.isLoading) { // Prevent multiple simultaneous fetches
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        if (STORAGE_MODE === 'local') {
          const res = await fetch(LOCAL_API_URL);
          const data = await res.json();
          dispatch({ type: 'SET_INITIAL_DATA', payload: data });
        } else if (STORAGE_MODE === 'supabase') {
          const membersResult = await supabaseClient.from('members').select('*');
          const photosResult = await supabaseClient.from('photos').select('*');
          
          if (membersResult.data) dispatch({ type: 'SET_MEMBERS', payload: membersResult.data });
          if (photosResult.data) dispatch({ type: 'SET_PHOTOS', payload: photosResult.data });
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch: dispatchWithSync as React.Dispatch<AppAction>,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
