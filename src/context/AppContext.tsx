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
      const { data, error } = await supabaseClient
        .from('members')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      
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
      
      const { data, error } = await supabaseClient
        .from('gallery')
        .select('id, title, description, url, photographer')
        .limit(100);

      if (error) throw error;
      
      if (isMountedRef.current) {
        const formattedData = (data || []).map(item => ({
          id: item.id,
          title: item.title || '',
          description: item.description || '',
          url: item.url || '',
          photographer: item.photographer || '',
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

  const fetchData = async () => {
    if (cachedDataRef.current.members) {
      dispatch({ type: 'SET_MEMBERS', payload: cachedDataRef.current.members });
    }
    if (cachedDataRef.current.photos) {
      dispatch({ type: 'SET_PHOTOS', payload: cachedDataRef.current.photos });
    }

    await Promise.all([fetchMembers(), fetchPhotos()]);
    dispatch({ type: 'SET_LAST_UPDATE', payload: Date.now() });
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    fetchData();

    fetchTimeoutRef.current = setInterval(fetchData, 3000);

    const onFocus = () => fetchData();
    window.addEventListener('focus', onFocus);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('focus', onFocus);
      if (fetchTimeoutRef.current) {
        clearInterval(fetchTimeoutRef.current);
      }
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
