import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AuthState, User } from '../types';

// For demo purposes - in production you'd use a real auth system
const DEMO_ADMIN_USER = {
  id: '1',
  username: 'admin',
  password: 'hornya123', // In a real app, never store passwords in plain text
  isAdmin: true
};

type AuthAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Load auth state from local storage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('techwibu_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN', payload: user });
      } catch (error) {
        localStorage.removeItem('techwibu_user');
      }
    }
  }, []);

  // In a real app, this would make an API call to a backend
  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === DEMO_ADMIN_USER.username && password === DEMO_ADMIN_USER.password) {
      const user = {
        id: DEMO_ADMIN_USER.id,
        username: DEMO_ADMIN_USER.username,
        isAdmin: DEMO_ADMIN_USER.isAdmin
      };
      
      dispatch({ type: 'LOGIN', payload: user });
      localStorage.setItem('techwibu_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('techwibu_user');
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
