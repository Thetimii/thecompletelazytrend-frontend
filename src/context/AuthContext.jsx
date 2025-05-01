import React, { createContext, useState, useEffect, useContext } from 'react';
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

  // Fetch user profile
  const fetchUserProfile = async (userId) => {
    try {
      let profile = await getUserProfile(userId);

      // If no profile exists, create a basic one
      if (!profile && userId) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            profile = await saveUserProfile({
              auth_id: userId,
              email: user.email,
              created_at: new Date().toISOString(),
              onboarding_completed: false
            });
            console.log("Created user profile from auth context");
          }
        } catch (createError) {
          console.error('Error creating user profile:', createError);
        }
      }

      setUserProfile(profile);
      setOnboardingComplete(profile?.onboarding_completed || false);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);

          // Fetch user profile
          await fetchUserProfile(user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);

          // Fetch user profile
          await fetchUserProfile(user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          setOnboardingComplete(false);
        }
      }
    );

    // Clean up listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle user logout
  const logout = async () => {
    try {
      console.log('Logging out user...');

      // Clear state first for immediate UI feedback
      setUser(null);
      setUserProfile(null);
      setOnboardingComplete(false);

      // Then perform the actual logout
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error from Supabase during logout:', error);
        throw error;
      }

      // Clear any local storage items that might be causing issues
      localStorage.removeItem('supabase.auth.token');

      // Force navigation to landing page
      window.location.href = '/';

      console.log('Logout successful');
    } catch (error) {
      console.error('Error logging out:', error);

      // Even if there's an error, force a clean state
      setUser(null);
      setUserProfile(null);
      setOnboardingComplete(false);

      // Force navigation to landing page as a fallback
      window.location.href = '/';
    }
  };

  // Function to update user profile in context
  const updateUserProfile = async (updatedProfile) => {
    if (updatedProfile) {
      setUserProfile(updatedProfile);
      setOnboardingComplete(updatedProfile.onboarding_completed || false);
    }
  };

  // Auth context value
  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    onboardingComplete,
    fetchUserProfile,
    updateUserProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
