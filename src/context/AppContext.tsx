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
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  const fetchData = async () => {
    if (!isMountedRef.current) return;
    
    try {
      // Get members with correct ordering
      const { data: membersData, error: membersError } = await supabaseClient
        .from('members')
        .select('*')
        .order('joinDate', { ascending: false });

      if (membersError) throw membersError;
      
      if (isMountedRef.current) {
        dispatch({ type: 'SET_MEMBERS', payload: membersData || [] });
      }

      // Get photos with correct ordering
      const getPhotos = async (retryCount = 0): Promise<Photo[]> => {
        try {
          const { data, error } = await supabaseClient
            .from('photos')
            .select('*')
            .order('uploadDate', { ascending: false });

          if (error) throw error;
          return data || [];
        } catch (err) {
          if (retryCount < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return getPhotos(retryCount + 1);
          }
          throw err;
        }
      };

      const photosData = await getPhotos();
      
      if (isMountedRef.current) {
        dispatch({ type: 'SET_PHOTOS', payload: photosData });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      if (isMountedRef.current) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    // Set up periodic refresh every 10 seconds
    fetchTimeoutRef.current = setInterval(fetchData, 10000);

    return () => {
      isMountedRef.current = false;
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
          .insert({ 
            ...action.payload,
            joinDate: new Date().toISOString() 
          });
        if (error) throw error;
      } else if (action.type === 'UPDATE_MEMBER') {
        const { error } = await supabaseClient
          .from('members')
          .update(action.payload)
          .eq('id', action.payload.id);
        if (error) throw error;
      } else if (action.type === 'DELETE_MEMBER') {
        const { error } = await supabaseClient
          .from('members')
          .delete()
          .eq('id', action.payload);
        if (error) throw error;
      } else if (action.type === 'ADD_PHOTO') {
        const { error } = await supabaseClient
          .from('photos')
          .insert({ 
            ...action.payload,
            uploadDate: new Date().toISOString() 
          });
        if (error) throw error;
      } else if (action.type === 'DELETE_PHOTO') {
        const { error } = await supabaseClient
          .from('photos')
          .delete()
          .eq('id', action.payload);
        if (error) throw error;
      }
      
      fetchData();
    } catch (error) {
      console.error("Supabase error:", error);
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
