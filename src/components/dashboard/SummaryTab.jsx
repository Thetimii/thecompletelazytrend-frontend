import React from 'react';
import StatCard from '../StatCard';
import RecommendationCard from '../RecommendationCard';
import { Bar } from 'react-chartjs-2';

const SummaryTab = ({ queries, videos, recommendations, chartData, chartOptions }) => {
  // Format date for the welcome message
  const formatDate = () => {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-primary-800 dark:text-primary-50">
          {getGreeting()}! <span className="text-accent-600 dark:text-accent-400">Welcome to LazyTrend</span>
        </h2>
        <p className="text-primary-600 dark:text-primary-300">
          Here's your TikTok marketing overview for {formatDate()}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Search Queries"
          value={queries.length}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          color="border-l-4 border-accent-500"
        />
        <StatCard
          title="TikTok Videos"
          value={videos.length}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          }
          color="border-l-4 border-green-500"
        />
        <StatCard
          title="Recommendations"
          value={recommendations.length}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="border-l-4 border-purple-500"
        />
      </div>

      {/* Chart */}
      {videos.length > 0 ? (
        <div className="card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary-800 dark:text-primary-100">Top Videos Performance</h3>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <div className="card p-6 mb-8 bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 border border-accent-200 dark:border-accent-800">
          <div className="flex items-center">
            <div className="mr-4 bg-accent-100 dark:bg-accent-800/50 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1 text-primary-800 dark:text-primary-100">No Video Data Yet</h3>
              <p className="text-primary-600 dark:text-primary-300">
                Run the workflow in the Settings tab to analyze TikTok videos and see performance metrics here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Latest Marketing Recommendations</h3>
            {recommendations.length > 3 && (
              <button className="text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 transition-colors">
                View All ({recommendations.length})
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {recommendations.slice(0, 3).map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-6 mb-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center">
            <div className="mr-4 bg-purple-100 dark:bg-purple-800/50 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1 text-primary-800 dark:text-primary-100">No Recommendations Yet</h3>
              <p className="text-primary-600 dark:text-primary-300">
                After analyzing videos, we'll generate AI-powered marketing recommendations for your business.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryTab;
