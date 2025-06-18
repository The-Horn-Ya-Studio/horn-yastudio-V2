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
  membersLoading: boolean;
  photosLoading: boolean;
  lastUpdate: number;
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
  | { type: 'SET_INITIAL_DATA'; payload: AppState }
  | { type: 'SET_MEMBERS_LOADING'; payload: boolean }
  | { type: 'SET_PHOTOS_LOADING'; payload: boolean }
  | { type: 'SET_LAST_UPDATE'; payload: number };

const initialState: AppState = {
  members: [],
  photos: [],
  isLoading: false,
  error: null,
  membersLoading: true,
  photosLoading: true,
  lastUpdate: 0
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
    case 'SET_MEMBERS_LOADING':
      newState = { ...state, membersLoading: action.payload };
      break;
    case 'SET_PHOTOS_LOADING':
      newState = { ...state, photosLoading: action.payload };
      break;
    case 'SET_LAST_UPDATE':
      newState = { ...state, lastUpdate: action.payload };
      break;
    default:
      return state;
  }
  return newState;
};

// Add retry utility
const retryWithBackoff = async (
  operation: () => Promise<any>,
  retries = 3,
  delay = 1000
): Promise<any> => {
  try {
    return await operation();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(operation, retries - 1, delay * 2);
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);
  const cachedDataRef = useRef<{
    members?: Member[];
    photos?: Photo[];
  }>({});

  const fetchMembers = async () => {
    try {
      dispatch({ type: 'SET_MEMBERS_LOADING', payload: true });
      
      const getData = async () => {
        const { data, error } = await supabaseClient
          .from('members')
          .select('id, name, role, bio, avatar, skills')
          .limit(50);
        
        if (error) throw error;
        return data;
      };

      const data = await retryWithBackoff(getData);
      
      if (isMountedRef.current) {
        cachedDataRef.current.members = data || [];
        dispatch({ type: 'SET_MEMBERS', payload: data || [] });
      }
    } catch (error) {
      console.error('Members fetch error:', error);
    } finally {
      dispatch({ type: 'SET_MEMBERS_LOADING', payload: false });
    }
  };

  const fetchPhotos = async () => {
    try {
      dispatch({ type: 'SET_PHOTOS_LOADING', payload: true });
      
      const getData = async () => {
        const { data, error } = await supabaseClient
          .from('gallery')
          .select('id, title, description, url, photographer')
          .limit(50);
        
        if (error) throw error;
        return data;
      };

      const data = await retryWithBackoff(getData);
      
      if (isMountedRef.current) {
        const formattedData = (data || []).map(item => ({
          ...item,
          uploadDate: new Date().toISOString()
        }));
        
        cachedDataRef.current.photos = formattedData;
        dispatch({ type: 'SET_PHOTOS', payload: formattedData });
      }
    } catch (error) {
      console.error('Photos fetch error:', error);
    } finally {
      dispatch({ type: 'SET_PHOTOS_LOADING', payload: false });
    }
  };

  // Modified fetchData with immediate cache response
  const fetchData = async () => {
    // Immediately show cached data if available
    if (cachedDataRef.current.members?.length) {
      dispatch({ type: 'SET_MEMBERS', payload: cachedDataRef.current.members });
    }
    if (cachedDataRef.current.photos?.length) {
      dispatch({ type: 'SET_PHOTOS', payload: cachedDataRef.current.photos });
    }

    // Fetch fresh data in parallel
    await Promise.all([
      fetchMembers().catch(console.error),
      fetchPhotos().catch(console.error)
    ]);

    dispatch({ type: 'SET_LAST_UPDATE', payload: Date.now() });
  };

  // Modified initial load effect
  useEffect(() => {
    isMountedRef.current = true;
    let pollTimeout: NodeJS.Timeout;

    const initialize = async () => {
      try {
        // Initial fetch
        await fetchData();
        
        // Start polling with longer interval
        const poll = () => {
          pollTimeout = setTimeout(async () => {
            if (isMountedRef.current) {
              await fetchData();
              poll();
            }
          }, 5000); // 5 second poll interval
        };
        
        poll();
      } catch (error) {
        console.error('Initialize error:', error);
      }
    };

    initialize();

    // Focus handler for immediate refresh
    const onFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', onFocus);

    return () => {
      isMountedRef.current = false;
      document.removeEventListener('visibilitychange', onFocus);
      if (pollTimeout) clearTimeout(pollTimeout);
    };
  }, []);

  const dispatchWithSync = async (action: AppAction) => {
    dispatch(action);

    try {
      if (action.type === 'ADD_MEMBER') {
        const { error } = await supabaseClient
          .from('members')
          .insert(action.payload);
        if (error) throw error;
        
        fetchMembers();
      } else if (action.type === 'ADD_PHOTO') {
        const { id, title, description, url, photographer } = action.payload;
        const { error } = await supabaseClient
          .from('gallery')
          .insert({ 
            id,
            title,
            description,
            url,
            photographer
          });
        if (error) throw error;
        
        fetchPhotos();
      } else if (action.type === 'UPDATE_MEMBER') {
        const { error } = await supabaseClient
          .from('members')
          .update(action.payload)
          .eq('id', action.payload.id);
        if (error) throw error;
        
        fetchMembers();
      } else if (action.type === 'DELETE_MEMBER') {
        const { error } = await supabaseClient
          .from('members')
          .delete()
          .eq('id', action.payload);
        if (error) throw error;
        
        fetchMembers();
      } else if (action.type === 'DELETE_PHOTO') {
        const { error } = await supabaseClient
          .from('gallery')
          .delete()
          .eq('id', action.payload);
        if (error) throw error;
        
        fetchPhotos();
      }
    } catch (error) {
      console.error("Sync error:", error);
      fetchData();
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save changes' });
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch: dispatchWithSync as React.Dispatch<AppAction>,
      refreshData: fetchData
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
