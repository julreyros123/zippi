import { create } from 'zustand';

// Simple in-memory auth store for React Native since localStorage isn't natively supported 
// without async-storage dependency hookups.

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: any, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user, token) => {
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
