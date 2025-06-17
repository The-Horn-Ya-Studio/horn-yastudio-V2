export interface Member {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  joinDate: string;
  skills: string[];
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    github?: string;
    discord?: string;
    website?: string;
    linkedin?: string;
  };
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  url: string;
  uploadDate: string;
  photographer: string;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

type AppAction = 
  | { type: 'SET_MEMBERS_LOADING'; payload: boolean }
  | { type: 'SET_PHOTOS_LOADING'; payload: boolean }
  | { type: 'SET_LAST_UPDATE'; payload: number };
