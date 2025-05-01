import React, { useState, useEffect } from 'react';
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a preference stored
    const savedMode = localStorage.getItem('darkMode');
    // Check if browser prefers dark mode
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedMode ? savedMode === 'true' : prefersDark;
  });

  // Define fetchData function first
  const fetchData = async () => {
    try {
      setLoading(true);

      // Make sure we have the user profile
      if (!userProfile && user?.id) {
        console.log('Fetching user profile first');
        await fetchUserProfile(user.id);
      }

      // Use the user ID from the profile (not the auth ID)
      const userId = userProfile?.id;
      console.log('Using user ID from profile:', userId);
      console.log('User profile:', userProfile);

      try {
        // Fetch queries for the current user
        const queriesData = userId
          ? await getTrendQueriesByUserId(userId)
          : await getTrendQueries();
        console.log('Queries data:', queriesData?.length || 0, 'queries');
        setQueries(queriesData || []);
      } catch (error) {
        console.warn('Error fetching trend queries, table might not exist yet:', error);
        setQueries([]);
      }

      // Fetch videos grouped by query for the current user
      // We'll use this data for both grouped and filtered views
      if (userId) {
        try {
          console.log('Fetching videos by query for user ID:', userId);
          const videosByQueryData = await getTikTokVideosByUserIdWithQueries(userId);
          console.log('Videos by query data:', videosByQueryData);

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
          console.error('Detailed error:', error);
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
        const recommendationsData = userId
          ? await getRecommendationsByUserId(userId)
          : await getRecommendations();
        console.log('Recommendations data:', recommendationsData?.length || 0, 'recommendations');
        setRecommendations(recommendationsData || []);
      } catch (error) {
        console.warn('Error fetching recommendations, table might not exist yet:', error);
        console.error('Detailed error:', error);
        setRecommendations([]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  };

  // Then use it in useEffect
  useEffect(() => {
    fetchData();
  }, [selectedQueryId, user?.id, userProfile?.id]);

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
          {/* Tab Content */}
          <div className="animate-fade-in max-w-7xl mx-auto">
            {activeTab === 'summary' && (
              <SummaryTab
                queries={queries}
                videos={videos}
                recommendations={recommendations}
                userProfile={userProfile}
              />
            )}

            {activeTab === 'videos' && (
              <VideosTab
                queries={queries}
                videos={videos}
                videosByQuery={videosByQuery}
                selectedQueryId={selectedQueryId}
                setSelectedQueryId={setSelectedQueryId}
              />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsTab
                userProfile={userProfile}
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

          {/* Empty State */}
          {videos.length === 0 && recommendations.length === 0 && queries.length === 0 && activeTab === 'summary' && (
            <div className="bg-white dark:bg-primary-900 p-10 rounded-2xl shadow-xl text-center mt-8 border border-primary-100 dark:border-primary-800 transition-all duration-300 animate-slide-up">
              <div className="mb-6">
                <div className="w-20 h-20 bg-accent-50 dark:bg-accent-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-primary-800 dark:text-primary-50">Get Started with LazyTrend</h3>
                <p className="text-primary-600 dark:text-primary-300 mb-6 max-w-lg mx-auto">
                  There are no search queries, videos, or recommendations available yet. Let's set up your first analysis.
                </p>
              </div>

              <div className="bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 dark:border-accent-600 p-4 mb-8 rounded-lg text-left max-w-lg mx-auto">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-accent-500 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-primary-800 dark:text-primary-200 font-medium">
                      Go to the Settings tab to generate search queries and analyze TikTok videos based on your business.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('settings')}
                className="btn btn-primary px-8 py-3 text-base"
              >
                Go to Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
