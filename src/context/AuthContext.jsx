import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAndSetUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (log in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAndSetUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAndSetUser = async (currentUser) => {
    if (currentUser) {
      // Enforce KIIT email domain
      if (!currentUser.email?.endsWith('@kiit.ac.in')) {
        await supabase.auth.signOut();
        setUser(null);
        setAuthError('Access denied. Please use your @kiit.ac.in email address.');
        return;
      }
    }
    setUser(currentUser);
    setAuthError(null);
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          // This hints Google to ask for a specific domain, though we still verify client-side
          hd: 'kiit.ac.in',
        },
        redirectTo: window.location.origin
      },
    });
    
    if (error) {
      setAuthError(error.message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    signInWithGoogle,
    signOut,
    loading,
    authError,
    setAuthError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
