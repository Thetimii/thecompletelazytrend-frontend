import React, { useState, useEffect, useCallback } from 'react';
import {
  getTrendQueries,
  getTikTokVideos,
  getRecommendations,
  getTrendQueriesByUserId,
  getTikTokVideosByTrendQueryId,
  getRecommendationsByUserId,
  getTikTokVideosByUserIdWithQueries
} from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { runCompleteWorkflow } from '../services/workflowService';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Import components
import Sidebar from '../components/Sidebar';
import SummaryTab from '../components/dashboard/SummaryTab';
import VideosTab from '../components/dashboard/VideosTab';
import RecommendationsTab from '../components/dashboard/RecommendationsTab';
import EmailScheduleTab from '../components/dashboard/EmailScheduleTab';
import SettingsTab from '../components/dashboard/SettingsTab';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user, userProfile, logout } = useAuth();
  const [queries, setQueries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videosByQuery, setVideosByQuery] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedQueryId, setSelectedQueryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [dataCache, setDataCache] = useState({
    queries: null,
    videos: null,
    videosByQuery: null,
    recommendations: null,
    lastFetched: null
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a preference stored
    const savedMode = localStorage.getItem('darkMode');
    // Check if browser prefers dark mode
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedMode ? savedMode === 'true' : prefersDark;
  });

  // Helper function to add timeout to promises
  const fetchWithTimeout = async (fetchFunction, timeout = 10000) => {
    return Promise.race([
      fetchFunction(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      )
    ]);
  };

  // Helper function to retry failed requests
  const fetchWithRetry = async (fetchFn, maxRetries = 2) => {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fetchFn();
      } catch (error) {
        console.warn(`Attempt ${attempt + 1} failed:`, error);
        lastError = error;
        // Wait before retrying (exponential backoff)
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }

    throw lastError;
  };

  // Define fetchData function with memoization
  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);

      // Check if we have cached data and it's less than 5 minutes old
      const now = Date.now();
      const cacheAge = dataCache.lastFetched ? now - dataCache.lastFetched : Infinity;
      const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes

      if (!forceRefresh && cacheValid && dataCache.queries && dataCache.videos && dataCache.videosByQuery && dataCache.recommendations) {
        // Use cached data
        console.log('Using cached data from', new Date(dataCache.lastFetched).toLocaleTimeString());
        setQueries(dataCache.queries);
        setVideos(dataCache.videos);
        setVideosByQuery(dataCache.videosByQuery);
        setRecommendations(dataCache.recommendations);
        setLoading(false);
        return;
      }

      // Make sure we have the user profile
      if (!userProfile && user?.id) {
        console.log('Fetching user profile first');
        await fetchUserProfile(user.id);
      }

      // Use the user ID from the profile (not the auth ID)
      const userId = userProfile?.id;
      console.log('Using user ID from profile:', userId);

      let queriesData = [];
      let videosByQueryData = [];
      let recommendationsData = [];

      try {
        // Fetch queries for the current user with timeout and retry
        queriesData = await fetchWithRetry(() =>
          fetchWithTimeout(() =>
            userId ? getTrendQueriesByUserId(userId) : getTrendQueries()
          )
        );
        console.log('Queries data:', queriesData?.length || 0, 'queries');
        setQueries(queriesData || []);
      } catch (error) {
        console.warn('Error fetching trend queries:', error);
        setQueries([]);
      }

      // Fetch videos grouped by query for the current user
      if (userId) {
        try {
          console.log('Fetching videos by query for user ID:', userId);
          videosByQueryData = await fetchWithRetry(() =>
            fetchWithTimeout(() =>
              getTikTokVideosByUserIdWithQueries(userId)
            )
          );

          // Set the videos by query data
          setVideosByQuery(videosByQueryData || []);

          // Also extract all videos for the filtered view
          const allVideos = [];
          if (videosByQueryData && videosByQueryData.length > 0) {
            videosByQueryData.forEach(group => {
              if (group.videos && group.videos.length > 0) {
                allVideos.push(...group.videos);
              }
            });
          }

          console.log('Total videos extracted:', allVideos.length);
          setVideos(allVideos);
        } catch (error) {
          console.warn('Error fetching videos by query:', error);
          setVideosByQuery([]);
          setVideos([]);
        }
      } else {
        console.log('No user ID available from profile, cannot fetch videos');
        setVideosByQuery([]);
        setVideos([]);
      }

      // Fetch recommendations for the current user
      try {
        recommendationsData = await fetchWithRetry(() =>
          fetchWithTimeout(() =>
            userId ? getRecommendationsByUserId(userId) : getRecommendations()
          )
        );
        console.log('Recommendations data:', recommendationsData?.length || 0, 'recommendations');
        setRecommendations(recommendationsData || []);
      } catch (error) {
        console.warn('Error fetching recommendations:', error);
        setRecommendations([]);
      }

      // Update cache with new data
      setDataCache({
        queries: queriesData || [],
        videos: videos || [],
        videosByQuery: videosByQueryData || [],
        recommendations: recommendationsData || [],
        lastFetched: Date.now()
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  }, [user, userProfile, dataCache]);

  // Initial data fetch when component mounts or user/profile changes
  useEffect(() => {
    fetchData();
  }, [fetchData, user?.id, userProfile?.id]);

  // Optimized effect to refresh data when tab changes
  useEffect(() => {
    // Only refetch data when switching to tabs that need fresh data
    // AND only if the data hasn't been loaded yet or needs refreshing
    if ((activeTab === 'summary' || activeTab === 'videos' || activeTab === 'recommendations')) {
      const tabNeedsData =
        (activeTab === 'summary' && (queries.length === 0 || videos.length === 0 || recommendations.length === 0)) ||
        (activeTab === 'videos' && (videos.length === 0 || videosByQuery.length === 0)) ||
        (activeTab === 'recommendations' && recommendations.length === 0);

      if (tabNeedsData) {
        console.log(`Tab changed to ${activeTab}, refreshing data...`);
        fetchData();
      } else {
        console.log(`Tab changed to ${activeTab}, using existing data`);
      }
    }
  }, [activeTab, fetchData, queries.length, videos.length, videosByQuery.length, recommendations.length]);

  // Effect to apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Effect to check for the triggerWorkflow flag and run the workflow if needed
  useEffect(() => {
    const checkAndTriggerWorkflow = async () => {
      // Check if we need to trigger the workflow
      const shouldTriggerWorkflow = localStorage.getItem('triggerWorkflow') === 'true';

      if (shouldTriggerWorkflow && user?.id && userProfile?.business_description && !loading) {
        console.log('Automatically triggering complete workflow after onboarding completion');
        try {
          // Remove the flag so we don't trigger it again
          localStorage.removeItem('triggerWorkflow');

          // Call the runCompleteWorkflow function with the same parameters as the button
          // Use the user ID from the profile (not the auth ID)
          const response = await runCompleteWorkflow(
            userProfile.business_description,
            userProfile.id, // Use profile ID instead of auth ID
            1 // Just 1 video per query for initial run
          );

          console.log('Auto-triggered workflow complete:', response);
          // Refresh data after workflow completes
          fetchData();
        } catch (err) {
          console.error('Error auto-triggering workflow:', err);
        }
      }
    };

    // Only run this effect after loading is complete and we have user data
    if (!loading && user?.id && userProfile) {
      checkAndTriggerWorkflow();
    }
  }, [user, userProfile, loading, fetchData]);

  // Prepare chart data for video metrics
  const topVideos = [...videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const chartData = {
    labels: topVideos.map(video => {
      const text = video.caption || video.description || 'Untitled';
      return text.length > 20 ? text.substring(0, 20) + '...' : text;
    }),
    datasets: [
      {
        label: 'Views',
        data: topVideos.map(video => video.views || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Likes',
        data: topVideos.map(video => video.likes || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 5 TikTok Videos Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleWorkflowComplete = () => {
    // Refresh the data after workflow completes
    fetchData();
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen fixed inset-0 bg-primary-50 dark:bg-primary-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 dark:border-primary-800"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-accent-500"></div>
          </div>
        </div>
        <p className="mt-4 text-primary-600 dark:text-primary-400 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-screen fixed inset-0 bg-primary-50 dark:bg-primary-950">
        <div className="bg-white dark:bg-primary-900 shadow-xl rounded-xl p-8 max-w-lg border border-red-200 dark:border-red-900" role="alert">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-bold text-primary-900 dark:text-primary-100">Error Loading Dashboard</h3>
          </div>
          <p className="text-primary-800 dark:text-primary-200 mb-4">{error}</p>
          <p className="text-primary-600 dark:text-primary-400 text-sm mb-6">Please try refreshing the page or contact support if the problem persists.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary w-full"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-primary-50 dark:bg-primary-950 transition-colors duration-300 fixed inset-0">
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern"></div>
        <div className="absolute inset-0 bg-texture"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <div className="ml-20 lg:ml-64 h-screen transition-all duration-300 relative z-10 overflow-y-auto">
        <div className="p-8">
          {/* Header with refresh button */}
          <div className="flex justify-between items-center mb-4">
            <div></div> {/* Empty div for flex spacing */}
            <button
              onClick={() => fetchData(true)} // Force refresh
              className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-all duration-300 text-primary-500 flex items-center"
              title="Refresh data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in max-w-7xl mx-auto">
            {activeTab === 'summary' && (
              <SummaryTab
                queries={queries}
                videos={videos}
                recommendations={recommendations}
                userProfile={userProfile}
                onTabChange={setActiveTab}
                onRefresh={() => fetchData(true)}
              />
            )}

            {activeTab === 'videos' && (
              <VideosTab
                queries={queries}
                videos={videos}
                videosByQuery={videosByQuery}
                selectedQueryId={selectedQueryId}
                setSelectedQueryId={setSelectedQueryId}
                onRefresh={() => fetchData(true)}
              />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsTab
                userProfile={userProfile}
                onRefresh={() => fetchData(true)}
              />
            )}

            {activeTab === 'email' && (
              <EmailScheduleTab
                user={user}
                userProfile={userProfile}
                onUpdate={(updatedProfile) => {
                  if (updatedProfile) {
                    console.log('Profile updated:', updatedProfile);
                    fetchData();
                  }
                }}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                user={user}
                userProfile={userProfile}
                onWorkflowComplete={handleWorkflowComplete}
              />
            )}
          </div>

          {/* Empty State - Removed as requested */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
