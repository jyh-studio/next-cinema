import { useState, useEffect } from 'react';
import { authStore } from '@/utils/authStore';
import { User } from '@/types';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>(authStore.getState());

  useEffect(() => {
    // Subscribe to auth store changes
    const unsubscribe = authStore.subscribe((newState) => {
      setAuthState(newState);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return authState;
};