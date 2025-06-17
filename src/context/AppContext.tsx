import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
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

  // --- LOCAL VM STORAGE MODE (via backend API) ---
  useEffect(() => {
    if (STORAGE_MODE === 'local') {
      const fetchData = async () => {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const res = await fetch(LOCAL_API_URL);
          const data = await res.json();
          dispatch({ type: 'SET_INITIAL_DATA', payload: data });
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load data from local VM' });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      };
      fetchData();
    }
  }, []);

  // --- SUPABASE MODE ---
  useEffect(() => {
    if (STORAGE_MODE === 'supabase') {
      const fetchData = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          const { data: membersData, error: membersError } = await supabaseClient.from('members').select('*');
          const { data: photosData, error: photosError } = await supabaseClient.from('photos').select('*');
          if (membersError || photosError) throw new Error('Failed to fetch data from Supabase');
          if (membersData) dispatch({ type: 'SET_MEMBERS', payload: membersData });
          if (photosData) dispatch({ type: 'SET_PHOTOS', payload: photosData });
          dispatch({ type: 'SET_ERROR', payload: null });
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      };
      fetchData();
    }
  }, []);

  // Middleware for sync
  const dispatchWithSync = async (action: AppAction) => {
    let nextState = appReducer(state, action);
    dispatch(action);

    if (STORAGE_MODE === 'local') {
      // Save to backend API
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
        
        // Refresh data setelah operasi supabase selesai untuk memastikan sync
        if (refreshData) await refreshData();
      } catch (error) {
        console.error("Supabase error:", error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save data to Supabase' });
        // Bisa tambahkan notifikasi/toast disini
      }
    }
  };

  // refreshData
  const refreshData = async () => {
    if (STORAGE_MODE === 'local') {
      const res = await fetch(LOCAL_API_URL);
      const data = await res.json();
      dispatch({ type: 'SET_INITIAL_DATA', payload: data });
    } else if (STORAGE_MODE === 'supabase') {
      const { data: membersData } = await supabaseClient.from('members').select('*');
      const { data: photosData } = await supabaseClient.from('photos').select('*');
      if (membersData) dispatch({ type: 'SET_MEMBERS', payload: membersData });
      if (photosData) dispatch({ type: 'SET_PHOTOS', payload: photosData });
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
