import React from 'react';
import StatCard from '../StatCard';
import RecommendationCard from '../RecommendationCard';
import { Bar } from 'react-chartjs-2';

const SummaryTab = ({ queries, videos, recommendations, chartData, chartOptions }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Summary</h2>
        <div className="ml-3 h-1 flex-grow bg-gradient-to-r from-accent-500 to-transparent rounded-full"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Search Queries"
          value={queries.length}
          icon={<span className="text-xl">🔍</span>}
          color="border-l-4 border-accent-500"
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
        <div className="glass-card p-6 mb-8 transform transition-all duration-500 hover:translate-y-[-5px]">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📈</span>
            <span>Top Videos Performance</span>
          </h3>
          <div className="bg-white/50 dark:bg-primary-800/50 p-4 rounded-lg backdrop-blur-sm">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <span className="mr-2">💡</span>
              <span>Latest Marketing Recommendations</span>
            </h3>
            <div className="ml-3 h-0.5 flex-grow bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
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
