import React from 'react';

const StrategyCard = ({ strategy }) => {
  // Parse the strategy JSON if it's a string
  const strategyData = typeof strategy.strategy === 'string' 
    ? JSON.parse(strategy.strategy) 
    : strategy.strategy;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-3">Marketing Strategy</h3>
      
      {strategyData.summary && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700">Summary</h4>
          <p className="text-gray-600 mt-1">{strategyData.summary}</p>
        </div>
      )}
      
      {strategyData.contentIdeas && strategyData.contentIdeas.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700">Content Ideas</h4>
          <ul className="list-disc pl-5 mt-1">
            {strategyData.contentIdeas.map((idea, index) => (
              <li key={index} className="text-gray-600">{idea}</li>
            ))}
          </ul>
        </div>
      )}
      
      {strategyData.recommendations && (
        <div>
          <h4 className="font-semibold text-gray-700">Recommendations</h4>
          <p className="text-gray-600 mt-1">{strategyData.recommendations}</p>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Based on {strategy.videos_analyzed} analyzed videos</p>
        <p>Created: {new Date(strategy.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default StrategyCard;
