import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../services/supabaseService';
import { getUserProfile, saveUserProfile } from '../services/userService';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Fetch user profile - using useCallback to maintain reference stability
  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId) {
      console.log('No userId provided to fetchUserProfile');
      return null;
    }

    console.log('Fetching user profile for userId:', userId);

    try {
      let profile = await getUserProfile(userId);
      console.log('Profile fetch result:', profile);

      // If no profile exists, create a basic one
      if (!profile) {
        try {
          const { data } = await supabase.auth.getUser();
          const authUser = data?.user;

          if (authUser) {
            console.log('Creating new user profile for:', authUser.email);
            profile = await saveUserProfile({
              auth_id: userId,
              email: authUser.email,
              created_at: new Date().toISOString(),
              onboarding_completed: false
            });
            console.log("Created user profile:", profile);
          }
        } catch (createError) {
          console.error('Error creating user profile:', createError);
        }
      }

      if (profile) {
        console.log('Setting user profile in state:', profile);
        setUserProfile(profile);
        setOnboardingComplete(profile.onboarding_completed || false);
      }

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  // Update user profile - using useCallback to maintain reference stability
  const updateUserProfile = useCallback(async (updatedProfile) => {
    console.log('Updating user profile in context:', updatedProfile);

    if (updatedProfile) {
      setUserProfile(updatedProfile);
      setOnboardingComplete(updatedProfile.onboarding_completed || false);
      return true;
    }
    return false;
  }, []);

  // Handle user logout - using useCallback to maintain reference stability
  const logout = useCallback(async () => {
    try {
      console.log('Logging out user');
      await supabase.auth.signOut();

      // Clear state
      setUser(null);
      setUserProfile(null);
      setOnboardingComplete(false);

      // Clear any auth-related localStorage items
      localStorage.removeItem('onboardingChecked');

      console.log('Logout successful');
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        console.log('Initializing auth state');
        setLoading(true);

        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (isMounted) {
            setLoading(false);
            setAuthInitialized(true);
          }
          return;
        }

        const session = sessionData?.session;

        if (session) {
          console.log('Found existing session');

          // Get user data
          const { data: userData, error: userError } = await supabase.auth.getUser();

          if (userError) {
            console.error('Error getting user:', userError);
            if (isMounted) {
              setLoading(false);
              setAuthInitialized(true);
            }
            return;
          }

          const authUser = userData?.user;

          if (authUser && isMounted) {
            console.log('Setting user in state:', authUser.email);
            setUser(authUser);

            // Fetch user profile
            await fetchUserProfile(authUser.id);
          }
        }
      } catch (error) {
        console.error('Error in auth initialization:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
          setAuthInitialized(true);
          console.log('Auth initialization complete');
        }
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session) {
          if (isMounted) {
            const { data } = await supabase.auth.getUser();
            const authUser = data?.user;

            if (authUser) {
              console.log('User signed in:', authUser.email);
              setUser(authUser);

              // Fetch user profile
              await fetchUserProfile(authUser.id);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            console.log('User signed out');
            setUser(null);
            setUserProfile(null);
            setOnboardingComplete(false);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Auth token refreshed');
        }
      }
    );

    // Clean up listener on unmount
    return () => {
      console.log('Cleaning up auth listener');
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Auth context value
  const contextValue = {
    user,
    userProfile,
    loading,
    authInitialized,
    isAuthenticated: !!user,
    onboardingComplete,
    fetchUserProfile,
    updateUserProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
