import React from 'react';

const RecommendationCard = ({ recommendation }) => {
  // Parse content ideas if they're stored as a string
  const getContentIdeas = () => {
    if (!recommendation.content_ideas) return [];

    if (typeof recommendation.content_ideas === 'string') {
      try {
        return JSON.parse(recommendation.content_ideas);
      } catch (e) {
        // If it's not valid JSON, split by newlines or return as a single item
        return recommendation.content_ideas.includes('\n')
          ? recommendation.content_ideas.split('\n').filter(Boolean)
          : [recommendation.content_ideas];
      }
    }

    return recommendation.content_ideas;
  };

  const contentIdeas = getContentIdeas();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-3">Marketing Recommendation</h3>

      {recommendation.combined_summary && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700">Summary</h4>
          <p className="text-gray-600 mt-1">{recommendation.combined_summary}</p>
        </div>
      )}

      {contentIdeas.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700">Content Ideas</h4>
          <ul className="list-disc pl-5 mt-1">
            {contentIdeas.map((idea, index) => (
              <li key={index} className="text-gray-600">{idea}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>Created: {new Date(recommendation.created_at).toLocaleDateString()}</p>
        {recommendation.video_ids && (
          <p className="mt-1">Based on {recommendation.video_ids.length} videos</p>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
