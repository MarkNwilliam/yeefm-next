'use client';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { auth, onAuthStateChanged, User } from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!auth) {
      console.error('Firebase Auth not initialized');
      setError('Firebase configuration error. Please check your environment variables.');
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, 
        (currentUser) => {
          setUser(currentUser);
          setLoading(false);
          setError(null);
        },
        (authError) => {
          console.error('Auth state change error:', authError);
          setError('Authentication error occurred');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to set up auth listener:', err);
      setError('Failed to initialize authentication');
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error
  }), [user, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}