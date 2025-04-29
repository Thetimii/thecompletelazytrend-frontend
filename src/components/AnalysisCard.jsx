import React from 'react';

const AnalysisCard = ({ analysis }) => {
  // Parse the analysis JSON if it's a string
  const analysisData = typeof analysis.analysis === 'string' 
    ? JSON.parse(analysis.analysis) 
    : analysis.analysis;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-3">Video Analysis</h3>
      
      {analysisData.summary && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700">Summary</h4>
          <p className="text-gray-600 mt-1">{analysisData.summary}</p>
        </div>
      )}
      
      {analysisData.keyPoints && analysisData.keyPoints.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700">Key Points</h4>
          <ul className="list-disc pl-5 mt-1">
            {analysisData.keyPoints.map((point, index) => (
              <li key={index} className="text-gray-600">{point}</li>
            ))}
          </ul>
        </div>
      )}
      
      {analysisData.marketingTactics && analysisData.marketingTactics.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700">Marketing Tactics</h4>
          <ul className="list-disc pl-5 mt-1">
            {analysisData.marketingTactics.map((tactic, index) => (
              <li key={index} className="text-gray-600">{tactic}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Created: {new Date(analysis.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default AnalysisCard;
