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

    // First get all queries for this user
    const { data: queries, error: queriesError } = await supabase
      .from('trend_queries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (queriesError) {
      console.error('Error getting trend queries:', queriesError);
      throw new Error(`Error getting trend queries: ${queriesError.message}`);
    }

    console.log('Queries found for user:', queries);

    if (!queries || queries.length === 0) {
      console.log('No queries found for user');
      return [];
    }

    // Get all videos for these queries
    const queryIds = queries.map(query => query.id);
    console.log('Query IDs to search for videos:', queryIds);

    // First try with the foreign key relationship
    let videos;
    let videosError;

    try {
      const result = await supabase
        .from('tiktok_videos')
        .select('*, trend_queries:trend_query_id(id, query)')
        .in('trend_query_id', queryIds)
        .order('created_at', { ascending: false });

      videos = result.data;
      videosError = result.error;

      console.log('Videos found with foreign key relationship:', videos?.length || 0);
    } catch (err) {
      console.warn('Error using foreign key relationship, trying direct query:', err);

      // If the foreign key relationship fails, try a direct query
      const result = await supabase
        .from('tiktok_videos')
        .select('*')
        .in('trend_query_id', queryIds)
        .order('created_at', { ascending: false });

      videos = result.data;
      videosError = result.error;

      console.log('Videos found with direct query:', videos?.length || 0);
    }

    if (videosError) {
      console.error('Error getting TikTok videos:', videosError);
      throw new Error(`Error getting TikTok videos: ${videosError.message}`);
    }

    if (!videos || videos.length === 0) {
      console.log('No videos found for queries');
      return [];
    }

    // Group videos by query
    const videosByQuery = {};
    const queriesMap = {};

    // Create a map of query IDs to query objects for easier lookup
    queries.forEach(query => {
      queriesMap[query.id] = query;
    });

    videos.forEach(video => {
      // Try to get query info from the foreign key relationship first
      let queryId = null;
      let queryText = null;

      if (video.trend_queries) {
        // Foreign key relationship worked
        queryId = video.trend_queries.id;
        queryText = video.trend_queries.query;
      } else if (video.trend_query_id && queriesMap[video.trend_query_id]) {
        // Direct query - use the trend_query_id field and look up the query
        queryId = video.trend_query_id;
        queryText = queriesMap[queryId].query;
      }

      if (queryId && queryText) {
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
      } else {
        console.warn('Could not determine query for video:', video);
      }
    });

    const result = Object.values(videosByQuery);
    console.log('Final grouped videos result:', result);

    // Convert to array for easier rendering
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
