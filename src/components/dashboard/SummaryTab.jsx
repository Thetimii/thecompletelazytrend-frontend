import React from 'react';
import StatCard from '../StatCard';
import RecommendationCard from '../RecommendationCard';
import { Bar } from 'react-chartjs-2';

const SummaryTab = ({ queries, videos, recommendations, chartData, chartOptions }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Dashboard Summary</h2>
      
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
        <div className="card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Top Videos Performance</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Latest Marketing Recommendations</h3>
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
