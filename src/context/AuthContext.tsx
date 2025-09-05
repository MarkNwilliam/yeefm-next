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
    console.log('🔐 AuthProvider: Setting up auth listener...');
    
    // Check if Firebase is properly initialized
    if (!auth) {
      console.error('❌ Firebase Auth not initialized');
      console.error('This usually means environment variables are missing');
      setError('Firebase configuration error. Please check your environment variables.');
      setLoading(false);
      return;
    }

    console.log('✅ Firebase Auth is initialized, setting up listener');

    try {
      const unsubscribe = onAuthStateChanged(auth, 
        (currentUser) => {
          console.log('🔐 Auth state changed:', currentUser ? 'User logged in' : 'User logged out');
          setUser(currentUser);
          setLoading(false);
          setError(null);
        },
        (authError) => {
          console.error('❌ Auth state change error:', authError);
          setError(`Authentication error: ${authError.message}`);
          setLoading(false);
        }
      );

      console.log('✅ Auth listener set up successfully');
      return () => {
        console.log('🔐 Cleaning up auth listener');
        unsubscribe();
      };
    } catch (err) {
      console.error('❌ Failed to set up auth listener:', err);
      setError(`Failed to initialize authentication: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error
  }), [user, loading, error]);

  // Show error state in UI for debugging
  if (error) {
    console.error('🚨 AuthProvider Error State:', error);
  }

  return (
    <AuthContext.Provider value={value}>
      {error && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ff4444',
          color: 'white',
          padding: '10px',
          textAlign: 'center',
          zIndex: 9999,
          fontSize: '14px'
        }}>
          🚨 Auth Error: {error}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}