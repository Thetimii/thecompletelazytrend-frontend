import { supabase } from './supabaseService';

/**
 * Create or update a user profile
 * @param {Object} userData - User data to save
 * @returns {Promise<Object>} - Saved user data
 */
export const saveUserProfile = async (userData) => {
  try {
    // Add updated_at timestamp
    const dataToSave = {
      ...userData,
      updated_at: new Date().toISOString()
    };

    // Check if user already exists by auth_id
    let existingUser = null;

    if (userData.auth_id) {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userData.auth_id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw fetchError;
      }

      existingUser = data;
    }

    // Also check by email as fallback
    if (!existingUser && userData.email) {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userData.email)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      existingUser = data;
    }

    let result;

    if (existingUser) {
      // Update existing user
      console.log("Updating existing user:", existingUser.id);
      console.log("Data to update:", dataToSave);

      // Remove fields that shouldn't be updated to avoid conflicts
      const { id, created_at, ...updateData } = dataToSave;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', existingUser.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating user:", error);
        throw error;
      }

      console.log("Update result:", data);
      result = data;
    } else {
      // Insert new user
      console.log("Inserting new user");
      console.log("Data to insert:", dataToSave);

      const { data, error } = await supabase
        .from('users')
        .insert(dataToSave)
        .select()
        .single();

      if (error) {
        console.error("Error inserting user:", error);
        throw error;
      }

      console.log("Insert result:", data);
      result = data;
    }

    return result;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

/**
 * Get a user profile by auth ID
 * @param {string} authId - Auth ID
 * @returns {Promise<Object>} - User profile
 */
export const getUserProfile = async (authId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Get a user profile by email
 * @param {string} email - User email
 * @returns {Promise<Object>} - User profile
 */
export const getUserProfileByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error getting user profile by email:', error);
    throw error;
  }
};

export default {
  saveUserProfile,
  getUserProfile,
  getUserProfileByEmail
};
