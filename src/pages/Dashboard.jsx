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
import StatCard from '../components/StatCard';
import VideoCard from '../components/VideoCard';
import RecommendationCard from '../components/RecommendationCard';
import QuerySelector from '../components/QuerySelector';
import WorkflowButton from '../components/WorkflowButton';
import ApiButtons from '../components/ApiButtons';
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
  const { user, userProfile } = useAuth();
  const [queries, setQueries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedQueryId, setSelectedQueryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workflowTriggered, setWorkflowTriggered] = useState(false);

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

  // Effect to trigger the workflow when a user first visits the dashboard after completing onboarding
  useEffect(() => {
    const triggerInitialWorkflow = async () => {
      // Only run if user is logged in, has a profile with business description, and workflow hasn't been triggered yet
      if (
        user?.id &&
        userProfile?.business_description &&
        userProfile?.onboarding_completed &&
        !workflowTriggered &&
        videos.length === 0 &&
        recommendations.length === 0
      ) {
        console.log('Automatically triggering complete workflow after onboarding completion');
        try {
          setWorkflowTriggered(true);
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
    if (!loading && user?.id) {
      triggerInitialWorkflow();
    }
  }, [user, userProfile, loading, workflowTriggered, videos.length, recommendations.length, fetchData]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  const handleWorkflowComplete = () => {
    // Refresh the data after workflow completes
    fetchData();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* API Buttons for individual API calls */}
      <ApiButtons />

      {/* Legacy Workflow Button */}
      <WorkflowButton onComplete={handleWorkflowComplete} />

      <QuerySelector
        queries={queries}
        selectedQueryId={selectedQueryId}
        onSelectQuery={setSelectedQueryId}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Search Queries"
          value={queries.length}
          icon={<span className="text-xl">🔍</span>}
          color="border-l-4 border-blue-500"
        />
        <StatCard
          title="TikTok Videos"
          value={videos.length}
          icon={<span className="text-xl">🎬</span>}
          color="border-l-4 border-green-500"
        />
        <StatCard
          title="Recommendations"
          value={recommendations.length}
          icon={<span className="text-xl">📊</span>}
          color="border-l-4 border-purple-500"
        />
      </div>

      {/* Chart */}
      {videos.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Marketing Recommendations</h2>
          <div className="grid grid-cols-1 gap-6">
            {recommendations.slice(0, 3).map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {videos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">TikTok Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Search Queries */}
      {queries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Search Queries</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ul className="divide-y divide-gray-200">
              {queries.map((query) => (
                <li key={query.id} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-medium text-gray-900">{query.query}</p>
                      <p className="text-sm text-gray-500">Created: {new Date(query.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => setSelectedQueryId(query.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                    >
                      View Videos
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Empty State */}
      {videos.length === 0 && recommendations.length === 0 && queries.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-2">No data available</h3>
          <p className="text-gray-600 mb-4">
            There are no search queries, videos, or recommendations available yet.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Start by generating search queries and scraping TikTok videos using the backend API.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
