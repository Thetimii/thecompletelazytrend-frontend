import axios from 'axios';
import { API_BASE_URL, buildApiUrl } from './apiConfig';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Run the complete workflow (generate queries, scrape videos, analyze, reconstruct)
 * @param {string} businessDescription - Description of the business
 * @param {string} userId - User ID
 * @param {number} videosPerQuery - Number of videos to fetch per query (default: 5)
 * @returns {Promise<Object>} - Workflow results
 */
export const runCompleteWorkflow = async (businessDescription, userId, videosPerQuery = 5) => {
  try {
    const response = await api.post(buildApiUrl('/complete-workflow'), {
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
 * Generate search queries
 * @param {string} businessDescription - Description of the business
 * @returns {Promise<Object>} - Generated search queries
 */
export const generateQueries = async (businessDescription) => {
  try {
    const response = await api.post(buildApiUrl('/generate-queries'), {
      businessDescription
    });

    return response.data;
  } catch (error) {
    console.error('Error generating queries:', error);
    throw error;
  }
};

/**
 * Generate search queries (alias for CustomSearchTab)
 * @param {string} businessDescription - Description of the business
 * @returns {Promise<Object>} - Generated search queries
 */
export const generateSearchQueries = generateQueries;

/**
 * Scrape TikTok videos
 * @param {string[]} searchQueries - Array of search queries
 * @param {string} userId - User ID
 * @param {number} videosPerQuery - Number of videos to fetch per query
 * @param {Object} customParams - Custom search parameters (sorting, days, videosLocation)
 * @returns {Promise<Object>} - Scraped videos
 */
export const scrapeTikTokVideos = async (searchQueries, userId, videosPerQuery = 5, customParams = {}) => {
  try {
    const response = await api.post(buildApiUrl('/scrape-tiktoks'), {
      searchQueries,
      userId,
      videosPerQuery,
      customParams
    });

    return response.data;
  } catch (error) {
    console.error('Error scraping TikTok videos:', error);
    throw error;
  }
};

/**
 * Analyze videos
 * @param {Object[]} videos - Array of videos to analyze
 * @param {string} businessDescription - Description of the business
 * @returns {Promise<Object>} - Analyzed videos
 */
export const analyzeVideos = async (videos, businessDescription) => {
  try {
    const response = await api.post(buildApiUrl('/analyze-videos'), {
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
 * Summarize trends from analyzed videos
 * @param {Object[]} analyzedVideos - Array of analyzed videos
 * @param {string} businessDescription - Description of the business
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Trend summary and recreation instructions
 */
export const summarizeTrends = async (analyzedVideos, businessDescription, userId = null) => {
  try {
    console.log('Summarizing trends from analyzed videos:', analyzedVideos.length);

    const response = await api.post(buildApiUrl('/summarize-trends'), {
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

    const response = await api.post(buildApiUrl('/delete-videos'), {
      fileNames,
      videoIds
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting videos:', error);
    throw error;
  }
};

/**
 * Test API connection
 * @returns {Promise<Object>} - API status
 */
export const testApi = async () => {
  try {
    console.log('Testing API connection...');
    const url = buildApiUrl('/test');
    console.log('API test URL:', url);
    const response = await api.get(url);
    console.log('API test successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error testing API:', error);
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
