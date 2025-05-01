import React, { useState, useEffect } from 'react';
import {
  getTrendQueries,
  getTikTokVideos,
  getRecommendations,
  getTrendQueriesByUserId,
  getTikTokVideosByTrendQueryId,
  getRecommendationsByUserId
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

      try {
        // Fetch queries for the current user
        const queriesData = user?.id
          ? await getTrendQueriesByUserId(user.id)
          : await getTrendQueries();
        setQueries(queriesData || []);
      } catch (error) {
        console.warn('Error fetching trend queries, table might not exist yet:', error);
        setQueries([]);
      }

      // Fetch data based on selected query
      if (selectedQueryId) {
        try {
          const videosData = await getTikTokVideosByTrendQueryId(selectedQueryId);
          setVideos(videosData || []);
        } catch (error) {
          console.warn('Error fetching TikTok videos, table might not exist yet:', error);
          setVideos([]);
        }
      } else {
        // Fetch all videos
        try {
          const videosData = await getTikTokVideos();
          setVideos(videosData || []);
        } catch (error) {
          console.warn('Error fetching TikTok videos, table might not exist yet:', error);
          setVideos([]);
        }
      }

      // Fetch recommendations for the current user
      try {
        const recommendationsData = user?.id
          ? await getRecommendationsByUserId(user.id)
          : await getRecommendations();
        setRecommendations(recommendationsData || []);
      } catch (error) {
        console.warn('Error fetching recommendations, table might not exist yet:', error);
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
  }, [selectedQueryId, user?.id]);

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
          const response = await runCompleteWorkflow(
            userProfile.business_description,
            user.id,
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
      <div className="flex justify-center items-center h-screen bg-primary-50 dark:bg-primary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-primary-50 dark:bg-primary-900">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg max-w-lg" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <p className="mt-2 text-sm">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-primary-50 dark:bg-primary-900 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <div className="ml-16 lg:ml-64 pt-16 transition-all duration-300">
        <div className="p-6">
          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'summary' && (
              <SummaryTab
                queries={queries}
                videos={videos}
                recommendations={recommendations}
                chartData={chartData}
                chartOptions={chartOptions}
              />
            )}

            {activeTab === 'videos' && (
              <VideosTab
                queries={queries}
                videos={videos}
                selectedQueryId={selectedQueryId}
                setSelectedQueryId={setSelectedQueryId}
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
            <div className="card p-8 text-center mt-8">
              <h3 className="text-xl font-semibold mb-2 text-primary-800 dark:text-primary-50">No data available</h3>
              <p className="text-primary-600 dark:text-primary-300 mb-4">
                There are no search queries, videos, or recommendations available yet.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Go to the Settings tab to generate search queries and analyze TikTok videos.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="btn btn-primary"
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
