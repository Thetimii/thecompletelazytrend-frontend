import axios from 'axios';

// Use the Vite proxy - all requests to /api will be forwarded to the backend
const API_URL = '/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Run the complete workflow (generate queries, scrape videos, analyze, reconstruct)
 * @param {string} businessDescription - Description of the business
 * @param {string} userId - User ID
 * @param {number} videosPerQuery - Number of videos to fetch per query (default: 1 for testing)
 * @returns {Promise<Object>} - Workflow results
 */
export const runCompleteWorkflow = async (businessDescription, userId, videosPerQuery = 1) => {
  try {
    const response = await api.post('/complete-workflow', {
      businessDescription,
      userId,
      videosPerQuery
    });

    return response.data;
  } catch (error) {
    console.error('Error running complete workflow:', error);
    throw error;
  }
};

/**
 * Generate search queries only
 * @param {string} businessDescription - Description of the business
 * @param {string} userId - User ID (optional)
 * @returns {Promise<Object>} - Generated queries
 */
export const generateQueries = async (businessDescription, userId = null) => {
  try {
    console.log('Sending request to generate queries with business description:', businessDescription);
    console.log('User ID:', userId);

    const response = await api.post('/generate-queries', {
      businessDescription,
      userId
    });

    console.log('Response from generate-queries endpoint:', response);
    return response.data;
  } catch (error) {
    console.error('Error generating queries:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to generate queries');
    }
    throw error;
  }
};

/**
 * Scrape TikTok videos based on search queries
 * @param {string[]} searchQueries - Array of search queries
 * @param {string} userId - User ID
 * @param {number} videosPerQuery - Number of videos to fetch per query
 * @returns {Promise<Object>} - Scraped videos
 */
export const scrapeTikTokVideos = async (searchQueries, userId, videosPerQuery = 1) => {
  try {
    console.log('Scraping TikTok videos with queries:', searchQueries);
    console.log('User ID:', userId);
    console.log('Videos per query:', videosPerQuery);

    const response = await api.post('/scrape-tiktoks', {
      searchQueries,
      userId,
      videosPerQuery
    });

    console.log('Response from scrape-tiktoks endpoint:', response.data);

    // If the response has a data property with videos, return it
    if (response.data && response.data.data && response.data.data.videos) {
      return {
        ...response.data.data,
        videos: response.data.data.videos || []
      };
    }

    // Otherwise, return an empty array of videos
    return {
      searchQueries,
      videosCount: 0,
      userId,
      videos: []
    };
  } catch (error) {
    console.error('Error scraping TikTok videos:', error);
    throw error;
  }
};

/**
 * Analyze videos
 * @param {Object[]} videos - Array of video data
 * @param {string} businessDescription - Description of the business
 * @returns {Promise<Object>} - Analyzed videos
 */
export const analyzeVideos = async (videos, businessDescription) => {
  try {
    const response = await api.post('/analyze-videos', {
      videos,
      businessDescription
    });

    return response.data;
  } catch (error) {
    console.error('Error analyzing videos:', error);
    throw error;
  }
};

/**
 * Test the API connection
 * @returns {Promise<Object>} - Test response
 */
export const testApi = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('Error testing API:', error);
    throw error;
  }
};

/**
 * Summarize trends from analyzed videos
 * @param {Object[]} analyzedVideos - Array of analyzed videos
 * @param {string} businessDescription - Description of the business
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Trend summary and recreation instructions
 */
export const summarizeTrends = async (analyzedVideos, businessDescription, userId = null) => {
  try {
    console.log('Summarizing trends from analyzed videos:', analyzedVideos.length);

    const response = await api.post('/summarize-trends', {
      analyzedVideos,
      businessDescription,
      userId
    });

    return response.data;
  } catch (error) {
    console.error('Error summarizing trends:', error);
    throw error;
  }
};

/**
 * Delete videos from storage bucket
 * @param {Array} fileNames - Array of file names to delete
 * @param {Array} videoIds - Array of video IDs
 * @returns {Promise<Object>} - Result of the deletion operation
 */
export const deleteVideos = async (fileNames, videoIds = []) => {
  try {
    console.log('Deleting videos from storage bucket:', fileNames.length);

    const response = await api.post('/delete-videos', {
      fileNames,
      videoIds
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting videos:', error);
    throw error;
  }
};

export default {
  runCompleteWorkflow,
  generateQueries,
  scrapeTikTokVideos,
  analyzeVideos,
  summarizeTrends,
  deleteVideos,
  testApi
};
