import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Member, Photo } from '../types';
import { supabaseClient } from '../supabase/client';

// Pilih mode storage: 'local' atau 'supabase'
const STORAGE_MODE = process.env.REACT_APP_STORAGE_MODE || 'local';

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
  // Persist ke localStorage jika mode local
  if (STORAGE_MODE === 'local') {
    localStorage.setItem('hornya_app_data', JSON.stringify({
      members: newState.members,
      photos: newState.photos
    }));
  }
  return newState;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // --- LOCAL STORAGE MODE ---
  useEffect(() => {
    if (STORAGE_MODE === 'local') {
      const savedData = localStorage.getItem('hornya_app_data');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData) as AppState;
          dispatch({ type: 'SET_INITIAL_DATA', payload: parsedData });
        } catch (error) {
          localStorage.removeItem('hornya_app_data');
        }
      }
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
      // Optional: subscribe to realtime changes
      // ...existing code for Supabase subscriptions if needed...
    }
  }, []);

  // Middleware for Supabase sync
  const dispatchWithSync = async (action: AppAction) => {
    dispatch(action);
    if (STORAGE_MODE === 'supabase') {
      try {
        if (action.type === 'ADD_MEMBER') {
          await supabaseClient.from('members').insert(action.payload);
        } else if (action.type === 'UPDATE_MEMBER') {
          await supabaseClient.from('members').update(action.payload).eq('id', action.payload.id);
        } else if (action.type === 'DELETE_MEMBER') {
          await supabaseClient.from('members').delete().eq('id', action.payload);
        } else if (action.type === 'ADD_PHOTO') {
          await supabaseClient.from('photos').insert(action.payload);
        } else if (action.type === 'DELETE_PHOTO') {
          await supabaseClient.from('photos').delete().eq('id', action.payload);
        }
      } catch (error) {
        // Optionally handle error
      }
    }
  };

  // refreshData only for supabase mode
  const refreshData = async () => {
    if (STORAGE_MODE === 'supabase') {
      const { data: membersData } = await supabaseClient.from('members').select('*');
      const { data: photosData } = await supabaseClient.from('photos').select('*');
      if (membersData) dispatch({ type: 'SET_MEMBERS', payload: membersData });
      if (photosData) dispatch({ type: 'SET_PHOTOS', payload: photosData });
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch: STORAGE_MODE === 'supabase' ? dispatchWithSync as React.Dispatch<AppAction> : dispatch,
      refreshData: STORAGE_MODE === 'supabase' ? refreshData : undefined
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
