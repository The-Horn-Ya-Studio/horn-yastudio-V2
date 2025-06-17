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
  const membersChannelRef = useRef<any>(null);
  const photosChannelRef = useRef<any>(null);
  const loadingAttemptRef = useRef(0);

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

  // --- IMMEDIATE DATA FETCH for Supabase mode ---
  useEffect(() => {
    if (STORAGE_MODE !== 'supabase') return;
    
    let isMounted = true;
    dispatch({ type: 'SET_LOADING', payload: true });
    
    const fetchInitialData = async () => {
      try {
        console.log('Fetching initial data from Supabase...');
        // Parallel fetching for faster load
        const [membersResult, photosResult] = await Promise.all([
          supabaseClient.from('members').select('*'),
          supabaseClient.from('photos').select('*')
        ]);
        
        if (!isMounted) return;
        
        if (membersResult.error) throw new Error(`Members fetch error: ${membersResult.error.message}`);
        if (photosResult.error) throw new Error(`Photos fetch error: ${photosResult.error.message}`);
        
        const membersData = membersResult.data || [];
        const photosData = photosResult.data || [];
        
        console.log(`Loaded ${membersData.length} members and ${photosData.length} photos`);
        
        dispatch({ type: 'SET_MEMBERS', payload: membersData });
        dispatch({ type: 'SET_PHOTOS', payload: photosData });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        console.error('Error fetching initial data:', error);
        if (isMounted) {
          dispatch({ type: 'SET_ERROR', payload: `Failed to load initial data: ${error instanceof Error ? error.message : 'Unknown error'}` });
          
          // Retry logic for initial load (max 3 attempts)
          if (loadingAttemptRef.current < 3) {
            loadingAttemptRef.current += 1;
            console.log(`Retrying data fetch, attempt ${loadingAttemptRef.current}...`);
            setTimeout(fetchInitialData, 2000); // Retry after 2 seconds
          }
        }
      } finally {
        if (isMounted) dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    fetchInitialData();
    
    return () => { isMounted = false; };
  }, []);

  // --- SUPABASE MODE: Realtime sync setup ---
  useEffect(() => {
    if (STORAGE_MODE !== 'supabase' || subscribed) {
      return; // Skip if not using Supabase or already subscribed
    }
    
    let isMounted = true;
    console.log('Setting up Supabase realtime subscriptions');
    
    const setupSubscriptions = async () => {
      if (subscribed || !isMounted) return;
      
      try {
        // Generate unique channel IDs for this session
        const timestamp = new Date().getTime();
        const membersChannelId = `members-channel-${timestamp}`;
        const photosChannelId = `photos-channel-${timestamp}`;
        
        // Create channels
        const membersChannel = supabaseClient
          .channel(membersChannelId)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, (payload) => {
            if (isMounted) {
              console.log('Members change received:', payload);
              refreshData();
            }
          });
        
        const photosChannel = supabaseClient
          .channel(photosChannelId)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, (payload) => {
            if (isMounted) {
              console.log('Photos change received:', payload);
              refreshData();
            }
          });
          
        // Subscribe sequentially to avoid race conditions
        await membersChannel.subscribe();
        await photosChannel.subscribe();
        
        // Store references only after successful subscription
        membersChannelRef.current = membersChannel;
        photosChannelRef.current = photosChannel;
        
        if (isMounted) {
          console.log('Successfully subscribed to all channels');
          setSubscribed(true);
        }
      } catch (error) {
        console.error('Error setting up Supabase subscriptions:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to subscribe to data changes' });
        
        // Retry subscription setup
        if (isMounted) {
          setTimeout(setupSubscriptions, 5000); // Retry after 5 seconds
        }
      }
    };

    setupSubscriptions();
    
    // Cleanup function to remove channels when component unmounts
    return () => {
      console.log('Cleaning up Supabase subscriptions...');
      isMounted = false;
      
      const cleanupChannels = async () => {
        try {
          if (membersChannelRef.current) {
            await supabaseClient.removeChannel(membersChannelRef.current);
            console.log('Members channel removed');
          }
        } catch (e) {
          console.error('Error removing members channel:', e);
        }
        
        try {
          if (photosChannelRef.current) {
            await supabaseClient.removeChannel(photosChannelRef.current);
            console.log('Photos channel removed');
          }
        } catch (e) {
          console.error('Error removing photos channel:', e);
        }
        
        membersChannelRef.current = null;
        photosChannelRef.current = null;
        setSubscribed(false);
      };
      
      cleanupChannels();
    };
  }, [subscribed]); // Only depends on subscribed state

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
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      if (STORAGE_MODE === 'local') {
        const res = await fetch(LOCAL_API_URL);
        const data = await res.json();
        dispatch({ type: 'SET_INITIAL_DATA', payload: data });
      } else if (STORAGE_MODE === 'supabase') {
        const [membersResult, photosResult] = await Promise.all([
          supabaseClient.from('members').select('*'),
          supabaseClient.from('photos').select('*')
        ]);
        
        if (membersResult.data) dispatch({ type: 'SET_MEMBERS', payload: membersResult.data });
        if (photosResult.data) dispatch({ type: 'SET_PHOTOS', payload: photosResult.data });
      }
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error("Error refreshing data:", error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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
