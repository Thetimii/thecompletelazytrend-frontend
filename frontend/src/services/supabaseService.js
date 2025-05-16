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
 * Get TikTok videos for the current user
 * @param {string} userId - User ID to filter videos by
 * @returns {Promise<Array>} - Array of TikTok videos
 */
export const getTikTokVideos = async (userId = null) => {
  try {
    // If no userId is provided, try to get the current user
    if (!userId) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
        }
      } catch (err) {
        console.warn('Could not get current user:', err);
      }
    }

    // If we have a userId, get videos for that user's queries
    if (userId) {
      // First get all queries for this user
      const { data: queries, error: queriesError } = await supabase
        .from('trend_queries')
        .select('id')
        .eq('user_id', userId);

      if (queriesError) {
        console.error('Error getting trend queries:', queriesError);
        return [];
      }

      if (!queries || queries.length === 0) {
        console.log('No queries found for user, returning empty videos array');
        return [];
      }

      // Get the query IDs
      const queryIds = queries.map(query => query.id);

      // Get videos for these queries
      const { data, error } = await supabase
        .from('tiktok_videos')
        .select('*')
        .eq('trend_query_id', queryIds)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error getting TikTok videos: ${error.message}`);
      }

      return data || [];
    } else {
      // Fallback to getting all videos (should rarely happen)
      console.warn('No user ID available, fetching all videos (not recommended)');
      const { data, error } = await supabase
        .from('tiktok_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20); // Limit to avoid fetching too many

      if (error) {
        throw new Error(`Error getting TikTok videos: ${error.message}`);
      }

      return data || [];
    }
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
    if (!userId) {
      console.warn('No user ID provided to getRecommendationsByUserId');
      return [];
    }

    // Skip logging to reduce console noise

    // First try exact match with the user_id
    let { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // If no results or error, try with a more flexible approach
    if ((!data || data.length === 0) && !error) {
      // Skip logging to reduce console noise

      // Get recommendations with a filter
      const { data: allRecs, error: flexError } = await supabase
        .from('recommendations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!flexError && allRecs) {
        // Convert userId to string for comparison
        const ourUserId = userId.toString();

        // Filter recommendations that have a user_id that contains our userId
        data = allRecs.filter(rec => {
          const recUserId = rec.user_id ? rec.user_id.toString() : '';
          return recUserId.includes(ourUserId) || ourUserId.includes(recUserId);
        });
      } else if (flexError) {
        error = flexError;
      }
    }

    if (error) {
      throw new Error(`Error getting recommendations: ${error.message}`);
    }

    // Skip logging to reduce console noise
    return data || [];
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
    if (!userId) {
      console.warn('No user ID provided to getTikTokVideosByUserIdWithQueries');
      return [];
    }

    // Step 1: Get all trend_queries for this user
    const { data: queries, error: queriesError } = await supabase
      .from('trend_queries')
      .select('id, query')
      .eq('user_id', userId);

    if (queriesError) {
      console.error('Error getting trend queries:', queriesError);
      throw new Error(`Error getting trend queries: ${queriesError.message}`);
    }

    if (!queries || queries.length === 0) {
      console.log('No queries found for user');
      return [];
    }

    // Step 2: Get the IDs from those queries
    const queryIds = queries.map(query => query.id);

    // Step 3: Get all tiktok_videos where trend_query_id is in that list
    // Order by created_at descending to get newest videos first
    const { data: videos, error: videosError } = await supabase
      .from('tiktok_videos')
      .select('*')
      .in('trend_query_id', queryIds)
      .order('created_at', { ascending: false });

    // Process video data from database

    if (videosError) {
      console.error('Error getting TikTok videos:', videosError);
      throw new Error(`Error getting TikTok videos: ${videosError.message}`);
    }

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

    // Convert to array and ensure videos in each group are sorted by created_at (newest first)
    const result = Object.values(videosByQuery);

    // Sort videos within each group by created_at (newest first)
    result.forEach(group => {
      if (group.videos && group.videos.length > 0) {
        group.videos.sort((a, b) => {
          // If created_at is available, use it for sorting
          if (a.created_at && b.created_at) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
          return 0;
        });
      }
    });

    return result;
  } catch (error) {
    console.error('Error getting TikTok videos with queries:', error);
    throw new Error('Failed to get TikTok videos with queries');
  }
};

/**
 * Get the latest recommendation for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Latest recommendation
 */
export const getLatestRecommendationByUserId = async (userId) => {
  try {
    if (!userId) {
      console.warn('No user ID provided to getLatestRecommendationByUserId');
      return null;
    }

    console.log('Fetching recommendation for user ID:', userId);

    // First try exact match with the user_id
    let { data } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    // If we got data, return the first item
    if (data && data.length > 0) {
      console.log('Found recommendation with exact match');
      return data[0];
    }

    // If no results with exact match, try with a more flexible approach
    console.log('No exact match found, trying flexible match');
    const { data: allRecs, error: flexError } = await supabase
      .from('recommendations')
      .select('*')
      .order('created_at', { ascending: false });

    if (flexError) {
      console.error('Error fetching all recommendations:', flexError);
      throw new Error(`Error getting recommendations: ${flexError.message}`);
    }

    if (allRecs && allRecs.length > 0) {
      // Convert userId to string for comparison
      const ourUserId = userId.toString();

      // Filter recommendations that have a user_id that contains our userId
      const matchingRecs = allRecs.filter(rec => {
        if (!rec.user_id) return false;
        const recUserId = rec.user_id.toString();
        return recUserId.includes(ourUserId) || ourUserId.includes(recUserId);
      });

      // Get the latest matching recommendation
      if (matchingRecs.length > 0) {
        console.log('Found recommendation with flexible match');
        return matchingRecs[0];
      }
    }

    console.log('No recommendations found for user');
    return null;
  } catch (error) {
    console.error('Error getting latest recommendation:', error);
    throw new Error('Failed to get latest recommendation');
  }
};

export default {
  getTrendQueries,
  getTrendQueriesByUserId,
  getTikTokVideos,
  getTikTokVideosByTrendQueryId,
  getRecommendations,
  getRecommendationsByUserId,
  getTikTokVideosByUserIdWithQueries,
  getLatestRecommendationByUserId
};
