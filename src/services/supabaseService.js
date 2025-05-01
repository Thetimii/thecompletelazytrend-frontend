import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get all trend queries
 * @returns {Promise<Array>} - Array of trend queries
 */
export const getTrendQueries = async () => {
  try {
    const { data, error } = await supabase
      .from('trend_queries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error getting trend queries: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting trend queries:', error);
    throw new Error('Failed to get trend queries');
  }
};

/**
 * Get trend queries by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of trend queries
 */
export const getTrendQueriesByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('trend_queries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error getting trend queries: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting trend queries:', error);
    throw new Error('Failed to get trend queries');
  }
};

/**
 * Get all TikTok videos
 * @returns {Promise<Array>} - Array of TikTok videos
 */
export const getTikTokVideos = async () => {
  try {
    const { data, error } = await supabase
      .from('tiktok_videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error getting TikTok videos: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting TikTok videos:', error);
    throw new Error('Failed to get TikTok videos');
  }
};

/**
 * Get TikTok videos by trend query ID
 * @param {string} trendQueryId - Trend query ID
 * @returns {Promise<Array>} - Array of TikTok videos
 */
export const getTikTokVideosByTrendQueryId = async (trendQueryId) => {
  try {
    const { data, error } = await supabase
      .from('tiktok_videos')
      .select('*')
      .eq('trend_query_id', trendQueryId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error getting TikTok videos: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting TikTok videos:', error);
    throw new Error('Failed to get TikTok videos');
  }
};

/**
 * Get all recommendations
 * @returns {Promise<Array>} - Array of recommendations
 */
export const getRecommendations = async () => {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error getting recommendations: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw new Error('Failed to get recommendations');
  }
};

/**
 * Get recommendations by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of recommendations
 */
export const getRecommendationsByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error getting recommendations: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw new Error('Failed to get recommendations');
  }
};

/**
 * Get TikTok videos by user ID with query information
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of TikTok videos with query information
 */
export const getTikTokVideosByUserIdWithQueries = async (userId) => {
  try {
    console.log('Getting videos by query for user ID:', userId);

    // Get the current user to double-check
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current authenticated user:', user);

    // Check all trend_queries to see what's available
    const { data: allQueries, error: allQueriesError } = await supabase
      .from('trend_queries')
      .select('id, query, user_id')
      .limit(10);

    console.log('Sample of all trend_queries:', allQueries);
    console.log('All queries error:', allQueriesError);

    // Step 1: Get all trend_queries for this user
    const { data: queries, error: queriesError } = await supabase
      .from('trend_queries')
      .select('id, query')
      .eq('user_id', userId);

    if (queriesError) {
      console.error('Error getting trend queries:', queriesError);
      throw new Error(`Error getting trend queries: ${queriesError.message}`);
    }

    console.log('Queries found for user:', queries);

    if (!queries || queries.length === 0) {
      console.log('No queries found for user');
      return [];
    }

    // Step 2: Get the IDs from those queries
    const queryIds = queries.map(query => query.id);
    console.log('Query IDs to search for videos:', queryIds);

    // Step 3: Get all tiktok_videos where trend_query_id is in that list
    const { data: videos, error: videosError } = await supabase
      .from('tiktok_videos')
      .select('*')
      .in('trend_query_id', queryIds);

    if (videosError) {
      console.error('Error getting TikTok videos:', videosError);
      throw new Error(`Error getting TikTok videos: ${videosError.message}`);
    }

    console.log('Videos found:', videos?.length || 0);

    if (!videos || videos.length === 0) {
      console.log('No videos found for queries');
      return [];
    }

    // Step 4: Create a map of query IDs to query objects for easier lookup
    const queriesMap = {};
    queries.forEach(query => {
      queriesMap[query.id] = query;
    });

    // Step 5: Group videos by their trend_query_id
    const videosByQuery = {};

    videos.forEach(video => {
      const queryId = video.trend_query_id;

      // Skip videos with no query ID or if the query doesn't exist in our map
      if (!queryId || !queriesMap[queryId]) {
        console.warn('Video has invalid trend_query_id:', video);
        return;
      }

      const queryText = queriesMap[queryId].query;

      if (!videosByQuery[queryId]) {
        videosByQuery[queryId] = {
          queryId,
          queryText,
          videos: []
        };
      }

      // Add video to the appropriate query group
      videosByQuery[queryId].videos.push({
        ...video,
        queryText: queryText // Add the query text to each video for easy reference
      });
    });

    const result = Object.values(videosByQuery);
    console.log('Final grouped videos result:', result);

    return result;
  } catch (error) {
    console.error('Error getting TikTok videos with queries:', error);
    throw new Error('Failed to get TikTok videos with queries');
  }
};

export default {
  getTrendQueries,
  getTrendQueriesByUserId,
  getTikTokVideos,
  getTikTokVideosByTrendQueryId,
  getRecommendations,
  getRecommendationsByUserId,
  getTikTokVideosByUserIdWithQueries
};
