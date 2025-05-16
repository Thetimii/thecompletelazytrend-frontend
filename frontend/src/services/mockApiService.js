/**
 * Mock API service for testing when the backend is not available
 * This simulates the backend API responses
 */

// Mock delay to simulate network request
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate mock search queries
 * @param {string} businessDescription - Business description
 * @returns {Promise<Object>} - Mock response
 */
export const generateQueries = async (businessDescription) => {
  await delay(1500); // Simulate network delay
  
  // Generate some mock queries based on the business description
  const words = businessDescription.split(' ').filter(word => word.length > 3);
  const searchQueries = [
    `trending ${words[0] || 'business'} ideas`,
    `${words[1] || 'popular'} ${words[0] || 'business'} tips`,
    `how to grow ${words[0] || 'business'} on TikTok`,
    `${words[0] || 'business'} hacks 2023`,
    `${words[0] || 'business'} trends`
  ];
  
  return {
    success: true,
    data: {
      searchQueries
    }
  };
};

/**
 * Scrape mock TikTok videos
 * @param {string[]} searchQueries - Search queries
 * @param {string} userId - User ID
 * @param {number} videosPerQuery - Videos per query
 * @returns {Promise<Object>} - Mock response
 */
export const scrapeTikTokVideos = async (searchQueries, userId, videosPerQuery = 1) => {
  await delay(2000); // Simulate network delay
  
  // Generate mock videos
  const videos = searchQueries.flatMap(query => {
    return Array(videosPerQuery).fill(0).map((_, index) => ({
      id: `video-${Math.random().toString(36).substring(2, 9)}`,
      query,
      video_url: `https://www.tiktok.com/@user/video/${Math.random().toString().substring(2, 12)}`,
      caption: `${query} - Amazing content for your business! #trending #viral #${query.split(' ').join('')}`,
      views: Math.floor(Math.random() * 1000000),
      likes: Math.floor(Math.random() * 50000),
      downloads: Math.floor(Math.random() * 1000),
      hashtags: ['trending', 'viral', 'business', 'tiktok'],
      created_at: new Date().toISOString()
    }));
  });
  
  return {
    success: true,
    data: {
      videos
    }
  };
};

/**
 * Analyze mock videos
 * @param {Object[]} videos - Videos to analyze
 * @param {string} businessDescription - Business description
 * @returns {Promise<Object>} - Mock response
 */
export const analyzeVideos = async (videos, businessDescription) => {
  await delay(3000); // Simulate network delay
  
  // Generate mock analysis
  const analyzedVideos = videos.map(video => ({
    ...video,
    summary: `This video about "${video.query}" has high engagement with ${video.views} views and ${video.likes} likes. The content is relevant to your business and could be adapted for your audience.`,
    transcript: `Hey everyone! Today I'm going to show you some amazing tips about ${video.query}. Make sure to follow for more content like this!`,
    frame_analysis: {
      key_frames: [
        { time: "00:00:05", description: "Introduction to the topic" },
        { time: "00:00:15", description: "Demonstrating the main point" },
        { time: "00:00:30", description: "Call to action and conclusion" }
      ],
      overall_quality: "high",
      lighting: "good",
      composition: "professional"
    }
  }));
  
  return {
    success: true,
    data: {
      analyzedVideos,
      summary: `Analyzed ${analyzedVideos.length} videos related to your business. The most engaging content focuses on practical tips and demonstrations.`,
      contentIdeas: [
        `Create a "how-to" video about ${businessDescription.split(' ').slice(0, 3).join(' ')}`,
        `Share your top 5 tips for success in your industry`,
        `Create a day-in-the-life video showing behind the scenes`,
        `Respond to common questions in your industry`,
        `Show before and after results of your product/service`
      ]
    }
  };
};

/**
 * Run complete mock workflow
 * @param {string} businessDescription - Business description
 * @param {string} userId - User ID
 * @param {number} videosPerQuery - Videos per query
 * @returns {Promise<Object>} - Mock response
 */
export const runCompleteWorkflow = async (businessDescription, userId, videosPerQuery = 1) => {
  await delay(1000); // Simulate network delay
  
  // Run each step in sequence
  const queriesResult = await generateQueries(businessDescription);
  const scrapingResult = await scrapeTikTokVideos(queriesResult.data.searchQueries, userId, videosPerQuery);
  const analysisResult = await analyzeVideos(scrapingResult.data.videos, businessDescription);
  
  return {
    success: true,
    data: {
      queries: queriesResult.data.searchQueries,
      videos: scrapingResult.data.videos,
      analysis: analysisResult.data,
      recommendations: {
        summary: analysisResult.data.summary,
        contentIdeas: analysisResult.data.contentIdeas
      }
    }
  };
};

export default {
  generateQueries,
  scrapeTikTokVideos,
  analyzeVideos,
  runCompleteWorkflow
};
