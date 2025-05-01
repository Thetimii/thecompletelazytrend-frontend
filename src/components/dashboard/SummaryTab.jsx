import React from 'react';
import StatCard from '../StatCard';
import RecommendationCard from '../RecommendationCard';
import { Bar } from 'react-chartjs-2';

const SummaryTab = ({ queries, videos, recommendations, chartData, chartOptions }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8">
        <h2 className="text-3xl font-bold gradient-text">Dashboard Summary</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="stat-card border-accent-500">
          <div>
            <h3 className="text-sm font-medium text-primary-500 dark:text-primary-400">Search Queries</h3>
            <p className="text-3xl font-bold mt-1 text-primary-800 dark:text-primary-50">{queries.length}</p>
          </div>
          <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-500 dark:text-accent-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <div className="stat-card border-green-500">
          <div>
            <h3 className="text-sm font-medium text-primary-500 dark:text-primary-400">TikTok Videos</h3>
            <p className="text-3xl font-bold mt-1 text-primary-800 dark:text-primary-50">{videos.length}</p>
          </div>
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>

        <div className="stat-card border-purple-500">
          <div>
            <h3 className="text-sm font-medium text-primary-500 dark:text-primary-400">Recommendations</h3>
            <p className="text-3xl font-bold mt-1 text-primary-800 dark:text-primary-50">{recommendations.length}</p>
          </div>
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Chart */}
      {videos.length > 0 && (
        <div className="dashboard-card mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100 flex items-center">
              <svg className="h-5 w-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
              Top Videos Performance
            </h3>
          </div>
          <div className="bg-primary-50 dark:bg-primary-800 p-6 rounded-lg">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100 flex items-center">
              <svg className="h-5 w-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              Latest Marketing Recommendations
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {recommendations.slice(0, 3).map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryTab;
