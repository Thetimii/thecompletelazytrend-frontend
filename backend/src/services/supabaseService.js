import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Bucket name for storing videos
const BUCKET_NAME = 'tiktok-videos';

/**
 * Initialize Supabase storage bucket if it doesn't exist
 */
export const initializeStorage = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);

    // Create bucket if it doesn't exist
    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Make bucket public so videos can be accessed without authentication
        fileSizeLimit: 50000000 // 50MB limit
      });

      if (error) {
        throw new Error(`Error creating bucket: ${error.message}`);
      }

      console.log('Created Supabase storage bucket:', BUCKET_NAME);
    }
  } catch (error) {
    console.error('Error initializing Supabase storage:', error);
    throw new Error('Failed to initialize Supabase storage');
  }
};

/**
 * Upload video buffer to Supabase storage
 * @param {Buffer} videoBuffer - Video data as buffer
 * @param {string} fileName - Name to save the file as
 * @returns {Promise<string>} - Public URL of the uploaded video
 */
export const uploadVideoToSupabase = async (videoBuffer, fileName) => {
  try {
    // Ensure bucket exists
    await initializeStorage();

    // Upload file from buffer
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`videos/${fileName}`, videoBuffer, {
        contentType: 'video/mp4',
        upsert: true // Overwrite if file exists
      });

    if (error) {
      throw new Error(`Error uploading video: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(`videos/${fileName}`);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw new Error('Failed to upload video to Supabase');
  }
};

/**
 * Save TikTok video metadata to the database
 * @param {Object} videoData - Video metadata
 * @param {string} trendQueryId - Trend query ID
 * @returns {Promise<Object>} - Saved video data
 */
export const saveTikTokVideo = async (videoData, trendQueryId) => {
  try {
    console.log(`Saving TikTok video with trend_query_id: ${trendQueryId}`);

    // Prepare the video data for insertion
    // Check the actual column names in the database
    const insertData = {
      video_url: videoData.video_url || videoData.originalUrl || `https://www.tiktok.com/@${videoData.author || 'unknown'}/video/unknown`,
      caption: videoData.caption || videoData.description || '',
      views: videoData.views || 0,
      likes: videoData.likes || 0,
      downloads: 0,
      hashtags: extractHashtags(videoData.caption || videoData.description || ''),
      created_at: new Date().toISOString()
    };

    // Add videoUrl field (this might be the actual column name instead of download_url)
    if (videoData.download_url || videoData.supabaseUrl) {
      insertData.videoUrl = videoData.download_url || videoData.supabaseUrl;
    }

    // Log the fields for debugging
    console.log(`Video URL: ${insertData.video_url}`);
    console.log(`Video Storage URL: ${insertData.videoUrl || 'none'}`);

    // Check if the thumbnail URL exists
    if (videoData.thumbnail_url) {
      insertData.thumbnail_url = videoData.thumbnail_url;
    } else if (videoData.coverUrl) {
      insertData.thumbnail_url = videoData.coverUrl;
    }

    // Handle trend_query_id - if not provided, create a default one
    if (trendQueryId) {
      insertData.trend_query_id = trendQueryId;
    } else {
      console.log('No trend_query_id provided, creating a default trend query');

      // Create a default trend query
      try {
        const defaultQuery = {
          query: videoData.caption ? `TikTok ${videoData.caption.split(' ').slice(0, 3).join(' ')}` : 'TikTok video'
        };

        // Use the userId from videoData if available
        if (videoData.userId) {
          defaultQuery.userId = videoData.userId;
        }

        const savedQuery = await saveTrendQuery(defaultQuery);

        if (savedQuery && savedQuery.id) {
          console.log(`Created default trend query with id: ${savedQuery.id}`);
          insertData.trend_query_id = savedQuery.id;
        } else {
          throw new Error('Failed to create default trend query');
        }
      } catch (queryError) {
        console.error(`Error creating default trend query: ${queryError.message}`);
        throw new Error('Cannot save TikTok video without a valid trend_query_id');
      }
    }

    console.log('Inserting video data:', insertData);

    const { data, error } = await supabase
      .from('tiktok_videos')
      .insert(insertData)
      .select();

    if (error) {
      throw new Error(`Error saving TikTok video: ${error.message}`);
    }

    return data[0];
  } catch (error) {
    console.error('Error saving TikTok video:', error);
    throw new Error('Failed to save TikTok video');
  }
};

/**
 * Extract hashtags from video caption
 * @param {string} caption - Video caption
 * @returns {string[]} - Array of hashtags
 */
const extractHashtags = (caption) => {
  if (!caption) return [];

  const hashtagRegex = /#[\w]+/g;
  const matches = caption.match(hashtagRegex);

  return matches || [];
};

/**
 * Save trend query to the database
 * @param {Object} queryData - Query data
 * @returns {Promise<Object>} - Saved query data
 */
export const saveTrendQuery = async (queryData) => {
  try {
    // Insert the trend query
    const insertData = {
      query: queryData.query
    };

    // Check if userId exists and try to find the user
    if (queryData.userId) {
      try {
        // Use the updated getUserProfile function that checks both auth_id and id
        const userProfile = await getUserProfile(queryData.userId);

        if (userProfile && userProfile.id) {
          console.log(`Found user with id: ${userProfile.id} for userId: ${queryData.userId}`);
          insertData.user_id = userProfile.id; // Use the user's ID from the users table
        } else {
          console.log(`No user found for userId: ${queryData.userId}`);

          // Create a default user if none exists
          console.log(`Creating a default user for trend query`);
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              auth_id: queryData.userId,
              email: `temp_${queryData.userId}@example.com`,
              created_at: new Date().toISOString(),
              onboarding_completed: true
            })
            .select();

          if (createError) {
            console.error(`Error creating default user: ${createError.message}`);
          } else if (newUser && newUser.length > 0) {
            console.log(`Created default user with id: ${newUser[0].id}`);
            insertData.user_id = newUser[0].id;
          }
        }
      } catch (userError) {
        console.error(`Error looking up user: ${userError.message}`);
      }
    }

    // If we still don't have a user_id, we need to create a system user
    if (!insertData.user_id) {
      console.log(`No valid user_id found, creating a system user`);

      // Check if system user already exists
      const { data: systemUser, error: systemError } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'system@lazytrend.com')
        .maybeSingle();

      if (!systemError && systemUser) {
        console.log(`Using existing system user with id: ${systemUser.id}`);
        insertData.user_id = systemUser.id;
      } else {
        // Create a system user
        const { data: newSystemUser, error: createSystemError } = await supabase
          .from('users')
          .insert({
            email: 'system@lazytrend.com',
            created_at: new Date().toISOString(),
            onboarding_completed: true
          })
          .select();

        if (createSystemError) {
          console.error(`Error creating system user: ${createSystemError.message}`);
          throw new Error(`Cannot save trend query without a valid user_id`);
        } else if (newSystemUser && newSystemUser.length > 0) {
          console.log(`Created system user with id: ${newSystemUser[0].id}`);
          insertData.user_id = newSystemUser[0].id;
        } else {
          throw new Error(`Failed to create system user`);
        }
      }
    }

    // Now we should have a valid user_id, so insert the trend query
    const { data, error } = await supabase
      .from('trend_queries')
      .insert(insertData)
      .select();

    if (error) {
      throw new Error(`Error saving trend query: ${error.message}`);
    }

    return data[0];
  } catch (error) {
    console.error('Error saving trend query:', error);
    throw new Error('Failed to save trend query');
  }
};

/**
 * Update TikTok video with analysis data
 * @param {string} videoId - Video ID
 * @param {Object} analysisData - Analysis data
 * @returns {Promise<Object>} - Updated video data
 */
export const updateTikTokVideoAnalysis = async (videoId, analysisData) => {
  try {
    console.log(`Updating TikTok video analysis for video ID: ${videoId}`);

    // Ensure frame_analysis is properly formatted as JSON
    let frameAnalysis = analysisData.frameAnalysis;
    if (typeof frameAnalysis === 'object') {
      frameAnalysis = JSON.stringify(frameAnalysis);
    }

    // Make sure summary is a string
    const summary = typeof analysisData.summary === 'string'
      ? analysisData.summary
      : (analysisData.summary ? JSON.stringify(analysisData.summary) : '');

    // Make sure transcript is a string
    const transcript = typeof analysisData.transcript === 'string'
      ? analysisData.transcript
      : (analysisData.transcript ? JSON.stringify(analysisData.transcript) : '');

    const { data, error } = await supabase
      .from('tiktok_videos')
      .update({
        summary: summary,
        transcript: transcript,
        frame_analysis: frameAnalysis,
        last_analyzed_at: new Date().toISOString()
      })
      .eq('id', videoId)
      .select();

    if (error) {
      throw new Error(`Error updating TikTok video analysis: ${error.message}`);
    }

    console.log(`Successfully updated TikTok video analysis for video ID: ${videoId}`);
    return data[0];
  } catch (error) {
    console.error('Error updating TikTok video analysis:', error);
    throw new Error('Failed to update TikTok video analysis');
  }
};

/**
 * Save recommendation to the database
 * @param {Object} recommendationData - Recommendation data
 * @returns {Promise<Object>} - Saved recommendation data
 */
export const saveRecommendation = async (recommendationData) => {
  try {
    console.log('Saving recommendation data to database');

    // Ensure data is properly formatted as JSON strings
    let combinedSummary = recommendationData.combinedSummary;
    let contentIdeas = recommendationData.contentIdeas;

    // If combinedSummary is an object, stringify it
    if (typeof combinedSummary === 'object') {
      combinedSummary = JSON.stringify(combinedSummary);
    }

    // If contentIdeas is an object, stringify it
    if (typeof contentIdeas === 'object') {
      contentIdeas = JSON.stringify(contentIdeas);
    }

    // Make sure videoIds is an array
    const videoIds = Array.isArray(recommendationData.videoIds)
      ? recommendationData.videoIds
      : (recommendationData.videoIds ? [recommendationData.videoIds] : []);

    // Create the insert data object
    const insertData = {
      combined_summary: combinedSummary,
      content_ideas: contentIdeas,
      video_ids: videoIds
    };

    // We must include a user_id as it's a NOT NULL column
    // The userId we receive could be either auth_id or regular id
    if (recommendationData.userId) {
      try {
        console.log(`Looking up user with userId: ${recommendationData.userId}`);
        // Use the updated getUserProfile function that checks both auth_id and id
        const userProfile = await getUserProfile(recommendationData.userId);

        if (userProfile && userProfile.id) {
          // Use the actual user.id
          insertData.user_id = userProfile.id;
          console.log(`Found user with id: ${userProfile.id} for userId: ${recommendationData.userId}`);
        } else {
          console.log(`No user found for userId: ${recommendationData.userId}, creating a default user`);

          // Create a default user
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              auth_id: recommendationData.userId,
              email: `temp_${recommendationData.userId}@example.com`,
              created_at: new Date().toISOString(),
              onboarding_completed: true
            })
            .select();

          if (createError) {
            console.error(`Error creating default user: ${createError.message}`);
            throw new Error(`Failed to create default user: ${createError.message}`);
          } else if (newUser && newUser.length > 0) {
            console.log(`Created default user with id: ${newUser[0].id}`);
            insertData.user_id = newUser[0].id;
          } else {
            throw new Error('Failed to create default user');
          }
        }
      } catch (userError) {
        console.error(`Error handling user: ${userError.message}`);

        // Try to use system user as fallback
        console.log(`Attempting to use system user as fallback`);
        const { data: systemUser, error: systemError } = await supabase
          .from('users')
          .select('id')
          .eq('email', 'system@lazytrend.com')
          .maybeSingle();

        if (!systemError && systemUser) {
          console.log(`Using existing system user with id: ${systemUser.id}`);
          insertData.user_id = systemUser.id;
        } else {
          throw new Error(`Cannot save recommendation without a valid user_id: ${userError.message}`);
        }
      }
    } else {
      // No userId provided, try to use system user
      console.log(`No userId provided, attempting to use system user`);

      const { data: systemUser, error: systemError } = await supabase
        .from('users')
        .select('id')
        .eq('email', 'system@lazytrend.com')
        .maybeSingle();

      if (!systemError && systemUser) {
        console.log(`Using existing system user with id: ${systemUser.id}`);
        insertData.user_id = systemUser.id;
      } else {
        // Create a system user
        const { data: newSystemUser, error: createSystemError } = await supabase
          .from('users')
          .insert({
            email: 'system@lazytrend.com',
            created_at: new Date().toISOString(),
            onboarding_completed: true
          })
          .select();

        if (createSystemError) {
          console.error(`Error creating system user: ${createSystemError.message}`);
          throw new Error(`Cannot save recommendation without a valid user_id`);
        } else if (newSystemUser && newSystemUser.length > 0) {
          console.log(`Created system user with id: ${newSystemUser[0].id}`);
          insertData.user_id = newSystemUser[0].id;
        } else {
          throw new Error(`Failed to create system user`);
        }
      }
    }

    const { data, error } = await supabase
      .from('recommendations')
      .insert(insertData)
      .select();

    if (error) {
      throw new Error(`Error saving recommendation: ${error.message}`);
    }

    console.log(`Successfully saved recommendation with ID: ${data[0].id}`);
    return data[0];
  } catch (error) {
    console.error('Error saving recommendation:', error);
    throw new Error('Failed to save recommendation');
  }
};

/**
 * Get TikTok videos by trend query ID
 * @param {string} trendQueryId - Trend query ID
 * @returns {Promise<Array>} - Array of videos
 */
export const getTikTokVideosByTrendQueryId = async (trendQueryId) => {
  try {
    const { data, error } = await supabase
      .from('tiktok_videos')
      .select('*')
      .eq('trend_query_id', trendQueryId);

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
 * Get trend queries by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of trend queries
 */
export const getTrendQueriesByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('trend_queries')
      .select('*')
      .eq('user_id', userId);

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
 * Get recommendations by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of recommendations
 */
export const getRecommendationsByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', userId);

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
 * Get user profile by user ID
 * @param {string} userId - User ID (can be auth_id or regular id)
 * @returns {Promise<Object>} - User profile
 */
export const getUserProfile = async (userId) => {
  try {
    // First try to find user by auth_id
    const { data: authData, error: authError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', userId)
      .maybeSingle();

    if (!authError && authData) {
      console.log(`Found user by auth_id: ${userId}`);
      return authData;
    }

    // If not found by auth_id, try by regular id
    const { data: idData, error: idError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!idError && idData) {
      console.log(`Found user by regular id: ${userId}`);
      return idData;
    }

    // If we get here, no user was found with either ID
    console.log(`No user found with auth_id or id: ${userId}`);
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to get user profile');
  }
};

/**
 * Get recent trend queries and their associated videos
 * @param {number} limit - Maximum number of trend queries to retrieve
 * @returns {Promise<Array>} - Array of trend queries with their videos
 */
export const getRecentTrendQueriesWithVideos = async (limit = 10) => {
  try {
    // Get the most recent trend queries
    const { data: trendQueries, error: trendQueryError } = await supabase
      .from('trend_queries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (trendQueryError) {
      throw new Error(`Error getting trend queries: ${trendQueryError.message}`);
    }

    console.log(`Found ${trendQueries.length} recent trend queries`);

    // Get videos associated with these trend queries
    const trendQueryIds = trendQueries.map(q => q.id);

    const { data: dbVideos, error: dbVideoError } = await supabase
      .from('tiktok_videos')
      .select('*')
      .in('trend_query_id', trendQueryIds);

    if (dbVideoError) {
      throw new Error(`Error getting videos for trend queries: ${dbVideoError.message}`);
    }

    console.log(`Found ${dbVideos.length} videos associated with these trend queries`);

    // Group videos by trend query
    const trendQueriesWithVideos = trendQueries.map(query => {
      const associatedVideos = dbVideos.filter(video => video.trend_query_id === query.id);
      return {
        ...query,
        videos: associatedVideos
      };
    });

    return trendQueriesWithVideos;
  } catch (error) {
    console.error('Error getting trend queries with videos:', error);
    throw new Error('Failed to get trend queries with videos');
  }
};

/**
 * Get videos from storage bucket that match database records
 * @param {Array} dbVideos - Array of video records from the database
 * @returns {Promise<Array>} - Array of video objects with storage URLs
 */
export const getVideosFromStorageBucket = async (dbVideos = []) => {
  try {
    // List all files in the videos folder of the storage bucket
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('videos');

    if (error) {
      throw new Error(`Error listing files in storage bucket: ${error.message}`);
    }

    console.log(`Found ${files.length} files in storage bucket`);

    // If no dbVideos provided, get all videos that need analysis
    if (dbVideos.length === 0) {
      const { data: allDbVideos, dbError } = await supabase
        .from('tiktok_videos')
        .select('*')
        .or('summary.is.null,last_analyzed_at.lt.' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (dbError) {
        throw new Error(`Error getting videos from database: ${dbError.message}`);
      }

      dbVideos = allDbVideos;
    }

    console.log(`Processing ${dbVideos.length} videos from database`);

    // Create video objects with storage URLs
    const videoObjects = [];

    for (const file of files) {
      if (file.name.endsWith('.mp4')) {
        // Get the public URL for the file
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`videos/${file.name}`);

        const storageUrl = publicUrlData.publicUrl;

        // Log the file name for debugging
        console.log(`Checking file: ${file.name}`);

        // Find the corresponding database record if it exists
        // This is more complex because the URLs might not match exactly
        let dbVideo = null;

        for (const v of dbVideos) {
          // Log the database record for debugging
          console.log(`Checking against DB record: ${v.id}`);
          console.log(`  download_url: ${v.download_url || 'none'}`);
          console.log(`  video_url: ${v.video_url || 'none'}`);

          // Try different matching strategies
          if ((v.download_url && v.download_url.includes(file.name)) ||
              (v.video_url && v.video_url.includes(file.name))) {
            dbVideo = v;
            console.log(`  MATCH FOUND by filename!`);
            break;
          }

          // Extract filename from download_url if it exists
          if (v.download_url) {
            const urlParts = v.download_url.split('/');
            const urlFilename = urlParts[urlParts.length - 1];
            if (urlFilename === file.name) {
              dbVideo = v;
              console.log(`  MATCH FOUND by extracted filename!`);
              break;
            }
          }
        }

        if (dbVideo) {
          videoObjects.push({
            id: dbVideo.id,
            fileName: file.name,
            storageUrl: storageUrl,
            dbRecord: dbVideo,
            trend_query_id: dbVideo.trend_query_id
          });
          console.log(`Added video object for file: ${file.name}, DB ID: ${dbVideo.id}`);
        } else {
          console.log(`No matching database record found for file: ${file.name}`);
        }
      }
    }

    console.log(`Created ${videoObjects.length} video objects with storage URLs that match database records`);
    return videoObjects;
  } catch (error) {
    console.error('Error getting videos from storage bucket:', error);
    throw new Error('Failed to get videos from storage bucket');
  }
};

/**
 * Delete videos from storage bucket
 * @param {Array} fileNames - Array of file names to delete
 * @returns {Promise<Object>} - Result of the deletion operation
 */
export const deleteVideosFromStorageBucket = async (fileNames) => {
  try {
    if (!Array.isArray(fileNames) || fileNames.length === 0) {
      console.log('No files to delete');
      return { deletedCount: 0 };
    }

    console.log(`Attempting to delete ${fileNames.length} files from storage bucket`);

    // Add 'videos/' prefix to each filename if not already present
    const filePaths = fileNames.map(fileName =>
      fileName.startsWith('videos/') ? fileName : `videos/${fileName}`
    );

    // Delete files from storage bucket
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths);

    if (error) {
      throw new Error(`Error deleting files from storage bucket: ${error.message}`);
    }

    console.log(`Successfully deleted ${data?.length || 0} files from storage bucket`);
    return { deletedCount: data?.length || 0, deletedFiles: data };
  } catch (error) {
    console.error('Error deleting files from storage bucket:', error);
    throw new Error('Failed to delete files from storage bucket');
  }
};

export default {
  supabase,
  initializeStorage,
  uploadVideoToSupabase,
  saveTikTokVideo,
  saveTrendQuery,
  updateTikTokVideoAnalysis,
  saveRecommendation,
  getTikTokVideosByTrendQueryId,
  getTrendQueriesByUserId,
  getRecommendationsByUserId,
  getUserProfile,
  getVideosFromStorageBucket,
  getRecentTrendQueriesWithVideos,
  deleteVideosFromStorageBucket
};
