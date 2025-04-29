import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  generateQueries,
  scrapeTikTokVideos,
  analyzeVideos,
  summarizeTrends,
  deleteVideos,
  runCompleteWorkflow,
  testApi
} from '../services/workflowService';

const ApiButtons = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});
  const [error, setError] = useState({});
  const [searchQueries, setSearchQueries] = useState([]);
  const [scrapedVideos, setScrapedVideos] = useState([]);
  const [analyzedVideos, setAnalyzedVideos] = useState([]);
  const [videoFileNames, setVideoFileNames] = useState([]);
  const [videosPerQuery, setVideosPerQuery] = useState(1);
  const [apiStatus, setApiStatus] = useState(null);

  // Test API connection on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setLoading({ ...loading, testApi: true });
        const response = await testApi();
        setApiStatus(response);
        setError({ ...error, testApi: null });
        console.log('API test successful:', response);
      } catch (err) {
        console.error('API test failed:', err);
        setApiStatus(null);
        setError({ ...error, testApi: err.message || 'Failed to connect to API' });
      } finally {
        setLoading({ ...loading, testApi: false });
      }
    };

    checkApiStatus();
  }, []);

  // Business description from user profile
  const businessDescription = userProfile?.business_description || '';

  // Handle generate queries
  const handleGenerateQueries = async () => {
    try {
      setLoading({ ...loading, generateQueries: true });
      setError({ ...error, generateQueries: null });

      // Pass user ID to use business description from user profile if available
      const response = await generateQueries(businessDescription, user?.id);
      console.log('Raw response from generate queries:', response);

      // Extract queries from the response
      let queries = [];
      if (response && response.data && response.data.searchQueries) {
        // Standard response format
        queries = response.data.searchQueries;
      } else if (response && response.searchQueries) {
        // Alternative format
        queries = response.searchQueries;
      } else if (Array.isArray(response)) {
        // Direct array format
        queries = response;
      }

      console.log('Extracted queries:', queries);
      setSearchQueries(queries);
      setResults({ ...results, generateQueries: { searchQueries: queries } });

      console.log('Generated queries:', queries);
    } catch (err) {
      console.error('Error generating queries:', err);
      setError({ ...error, generateQueries: err.message || 'Failed to generate queries' });
    } finally {
      setLoading({ ...loading, generateQueries: false });
    }
  };

  // Handle scrape TikToks
  const handleScrapeTikToks = async () => {
    if (searchQueries.length === 0) {
      setError({ ...error, scrapeTikToks: 'Please generate search queries first' });
      return;
    }

    try {
      setLoading({ ...loading, scrapeTikToks: true });
      setError({ ...error, scrapeTikToks: null });

      const response = await scrapeTikTokVideos(searchQueries, user?.id, videosPerQuery);
      const videos = response.videos || [];
      setScrapedVideos(videos);
      setResults({ ...results, scrapeTikToks: response });

      // Extract and store video filenames for later deletion
      const fileNames = [];
      if (videos && Array.isArray(videos)) {
        videos.forEach(video => {
          if (video.supabaseUrl) {
            // Extract filename from the URL
            const urlParts = video.supabaseUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            if (fileName) {
              fileNames.push(fileName);
            }
          }
        });
      }

      setVideoFileNames(fileNames);
      console.log('Stored video filenames for later deletion:', fileNames);

      console.log('Scraped TikTok videos:', response);
    } catch (err) {
      console.error('Error scraping TikTok videos:', err);
      setError({ ...error, scrapeTikToks: err.message || 'Failed to scrape TikTok videos' });
    } finally {
      setLoading({ ...loading, scrapeTikToks: false });
    }
  };

  // Handle analyze videos
  const handleAnalyzeVideos = async () => {
    if (scrapedVideos.length === 0) {
      setError({ ...error, analyzeVideos: 'Please scrape TikTok videos first' });
      return;
    }

    try {
      setLoading({ ...loading, analyzeVideos: true });
      setError({ ...error, analyzeVideos: null });

      const response = await analyzeVideos(scrapedVideos, businessDescription);

      // Store the analyzed videos for use in summarizeTrends
      if (response && response.data && Array.isArray(response.data)) {
        setAnalyzedVideos(response.data);
      } else if (Array.isArray(response)) {
        setAnalyzedVideos(response);
      }

      setResults({ ...results, analyzeVideos: response });

      console.log('Analyzed videos:', response);
    } catch (err) {
      console.error('Error analyzing videos:', err);
      setError({ ...error, analyzeVideos: err.message || 'Failed to analyze videos' });
    } finally {
      setLoading({ ...loading, analyzeVideos: false });
    }
  };

  // Handle complete workflow
  const handleCompleteWorkflow = async () => {
    try {
      setLoading({ ...loading, completeWorkflow: true });
      setError({ ...error, completeWorkflow: null });

      const response = await runCompleteWorkflow(businessDescription, user?.id, videosPerQuery);
      setResults({ ...results, completeWorkflow: response });

      console.log('Complete workflow results:', response);
    } catch (err) {
      console.error('Error running complete workflow:', err);
      setError({ ...error, completeWorkflow: err.message || 'Failed to run complete workflow' });
    } finally {
      setLoading({ ...loading, completeWorkflow: false });
    }
  };

  // Handle summarize trends
  const handleSummarizeTrends = async () => {
    if (analyzedVideos.length === 0) {
      setError({ ...error, summarizeTrends: 'Please analyze videos first' });
      return;
    }

    try {
      setLoading({ ...loading, summarizeTrends: true });
      setError({ ...error, summarizeTrends: null });

      const response = await summarizeTrends(analyzedVideos, businessDescription, user?.id);
      setResults({ ...results, summarizeTrends: response });

      console.log('Trend summary:', response);
    } catch (err) {
      console.error('Error summarizing trends:', err);
      setError({ ...error, summarizeTrends: err.message || 'Failed to summarize trends' });
    } finally {
      setLoading({ ...loading, summarizeTrends: false });
    }
  };

  // Handle delete videos
  const handleDeleteVideos = async () => {
    if (videoFileNames.length === 0) {
      setError({ ...error, deleteVideos: 'No videos to delete' });
      return;
    }

    try {
      setLoading({ ...loading, deleteVideos: true });
      setError({ ...error, deleteVideos: null });

      // Extract video IDs from analyzed videos
      const videoIds = analyzedVideos
        .filter(video => video.id || video.dbId)
        .map(video => video.id || video.dbId);

      const response = await deleteVideos(videoFileNames, videoIds);
      setResults({ ...results, deleteVideos: response });

      // Clear the video filenames after deletion
      setVideoFileNames([]);

      console.log('Deleted videos:', response);
    } catch (err) {
      console.error('Error deleting videos:', err);
      setError({ ...error, deleteVideos: err.message || 'Failed to delete videos' });
    } finally {
      setLoading({ ...loading, deleteVideos: false });
    }
  };

  // Handle test API
  const handleTestApi = async () => {
    try {
      setLoading({ ...loading, testApi: true });
      setError({ ...error, testApi: null });

      const response = await testApi();
      setApiStatus(response);

      console.log('API test successful:', response);
    } catch (err) {
      console.error('API test failed:', err);
      setError({ ...error, testApi: err.message || 'Failed to connect to API' });
      setApiStatus(null);
    } finally {
      setLoading({ ...loading, testApi: false });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">API Actions</h2>

      {/* API Status */}
      <div className={`mb-4 p-3 rounded-lg ${apiStatus ? 'bg-green-50' : error.testApi ? 'bg-red-50' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">API Connection Status</h3>
            <p className="text-sm">
              {apiStatus ?
                `Connected to API (${apiStatus.timestamp})` :
                error.testApi ?
                  `Error connecting to API: ${error.testApi}` :
                  'Checking API connection...'}
            </p>
          </div>
          <button
            onClick={handleTestApi}
            disabled={loading.testApi}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading.testApi ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="videosPerQuery" className="block text-sm font-medium text-gray-700 mb-2">
          Videos Per Query
        </label>
        <input
          id="videosPerQuery"
          type="number"
          min="1"
          max="10"
          value={videosPerQuery}
          onChange={(e) => setVideosPerQuery(parseInt(e.target.value) || 1)}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
        <p className="mt-1 text-sm text-gray-500">
          Number of videos to fetch per search query (1-10)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Generate Queries Button */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">1. Generate Search Queries</h3>
          <p className="text-sm text-gray-600 mb-3">
            Generate TikTok search queries based on your business description.
          </p>
          <button
            onClick={handleGenerateQueries}
            disabled={loading.generateQueries || (!businessDescription && !user?.id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading.generateQueries ? 'Generating...' : 'Generate Queries'}
          </button>
          {error.generateQueries && (
            <p className="mt-2 text-sm text-red-600">{error.generateQueries}</p>
          )}
          {results.generateQueries && (
            <div className="mt-2">
              <p className="text-sm font-medium text-green-600">Generated {searchQueries.length} queries</p>
              <div className="mt-1 max-h-24 overflow-y-auto text-xs bg-gray-50 p-2 rounded">
                {searchQueries.map((query, index) => (
                  <div key={index} className="mb-1">{query}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scrape TikToks Button */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">2. Scrape TikTok Videos</h3>
          <p className="text-sm text-gray-600 mb-3">
            Scrape TikTok videos based on the generated search queries.
          </p>
          <button
            onClick={handleScrapeTikToks}
            disabled={loading.scrapeTikToks || searchQueries.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading.scrapeTikToks ? 'Scraping...' : 'Scrape TikToks'}
          </button>
          {error.scrapeTikToks && (
            <p className="mt-2 text-sm text-red-600">{error.scrapeTikToks}</p>
          )}
          {results.scrapeTikToks && (
            <div className="mt-2">
              <p className="text-sm font-medium text-green-600">Scraped {scrapedVideos.length} videos</p>
            </div>
          )}
        </div>

        {/* Analyze Videos Button */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">3. Analyze Videos</h3>
          <p className="text-sm text-gray-600 mb-3">
            Analyze the scraped TikTok videos to extract insights.
          </p>
          <button
            onClick={handleAnalyzeVideos}
            disabled={loading.analyzeVideos || scrapedVideos.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading.analyzeVideos ? 'Analyzing...' : 'Analyze Videos'}
          </button>
          {error.analyzeVideos && (
            <p className="mt-2 text-sm text-red-600">{error.analyzeVideos}</p>
          )}
          {results.analyzeVideos && (
            <div className="mt-2">
              <p className="text-sm font-medium text-green-600">Analysis complete</p>
            </div>
          )}
        </div>

        {/* Summarize Trends Button */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">4. Summarize Trends</h3>
          <p className="text-sm text-gray-600 mb-3">
            Get a summary of trends and recreation instructions from analyzed videos.
          </p>
          <button
            onClick={handleSummarizeTrends}
            disabled={loading.summarizeTrends || analyzedVideos.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading.summarizeTrends ? 'Summarizing...' : 'Summarize Trends'}
          </button>
          {error.summarizeTrends && (
            <p className="mt-2 text-sm text-red-600">{error.summarizeTrends}</p>
          )}
          {results.summarizeTrends && (
            <div className="mt-2">
              <p className="text-sm font-medium text-green-600">Trend summary complete</p>
              {results.summarizeTrends.data && results.summarizeTrends.data.trendSummary && (
                <div className="mt-2 max-h-80 overflow-y-auto text-xs bg-gray-50 p-2 rounded">
                  <p className="font-medium">Trend Summary:</p>
                  <p className="mb-2">{typeof results.summarizeTrends.data.trendSummary === 'object'
                    ? JSON.stringify(results.summarizeTrends.data.trendSummary, null, 2)
                    : results.summarizeTrends.data.trendSummary}</p>

                  {results.summarizeTrends.data.recommendationId && (
                    <p className="text-green-600 font-medium">
                      Saved to database with ID: {results.summarizeTrends.data.recommendationId}
                    </p>
                  )}

                  {results.summarizeTrends.data.recreationSteps && results.summarizeTrends.data.recreationSteps.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Recreation Steps:</p>
                      <ol className="list-decimal list-inside">
                        {results.summarizeTrends.data.recreationSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {results.summarizeTrends.data.suggestedHashtags && results.summarizeTrends.data.suggestedHashtags.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Suggested Hashtags:</p>
                      <div className="flex flex-wrap gap-1">
                        {results.summarizeTrends.data.suggestedHashtags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-1 rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Delete Videos button inside the summary section */}
                  {videoFileNames.length > 0 && (
                    <div className="mt-4 border-t pt-2">
                      <button
                        onClick={handleDeleteVideos}
                        disabled={loading.deleteVideos}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 text-xs rounded focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 disabled:opacity-50"
                      >
                        {loading.deleteVideos ? 'Deleting...' : `Delete ${videoFileNames.length} Videos`}
                      </button>
                      {error.deleteVideos && (
                        <p className="mt-1 text-xs text-red-600">{error.deleteVideos}</p>
                      )}
                      {results.deleteVideos && (
                        <p className="mt-1 text-xs text-green-600">
                          Successfully deleted {results.deleteVideos.data?.deletedCount || 0} videos
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Videos Button (standalone) */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">5. Clean Up Videos</h3>
          <p className="text-sm text-gray-600 mb-3">
            Delete the videos from storage after summarizing trends to save space.
          </p>
          <button
            onClick={handleDeleteVideos}
            disabled={loading.deleteVideos || videoFileNames.length === 0}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading.deleteVideos ? 'Deleting...' : `Delete ${videoFileNames.length} Videos`}
          </button>
          {error.deleteVideos && (
            <p className="mt-2 text-sm text-red-600">{error.deleteVideos}</p>
          )}
          {results.deleteVideos && (
            <div className="mt-2">
              <p className="text-sm font-medium text-green-600">
                Successfully deleted {results.deleteVideos.data?.deletedCount || 0} videos
              </p>
            </div>
          )}
        </div>

        {/* Complete Workflow Button */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Complete Workflow</h3>
          <p className="text-sm text-gray-600 mb-3">
            Run the complete workflow (generate queries, scrape videos, analyze).
          </p>
          <button
            onClick={handleCompleteWorkflow}
            disabled={loading.completeWorkflow || (!businessDescription && !user?.id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading.completeWorkflow ? 'Processing...' : 'Run Complete Workflow'}
          </button>
          {error.completeWorkflow && (
            <p className="mt-2 text-sm text-red-600">{error.completeWorkflow}</p>
          )}
          {results.completeWorkflow && (
            <div className="mt-2">
              <p className="text-sm font-medium text-green-600">Workflow complete</p>
              {results.completeWorkflow.data && (
                <div className="mt-1 text-xs">
                  <p>Videos processed: {results.completeWorkflow.data.videosCount || 0}</p>
                  <p>Videos analyzed: {results.completeWorkflow.data.analyzedVideosCount || 0}</p>
                  {results.completeWorkflow.data.deletedVideosCount !== undefined && (
                    <p className="text-green-600">Videos deleted: {results.completeWorkflow.data.deletedVideosCount}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <p>Note: These actions interact directly with the backend API endpoints.</p>
        <p>The complete workflow button runs all steps in sequence.</p>
      </div>
    </div>
  );
};

export default ApiButtons;
