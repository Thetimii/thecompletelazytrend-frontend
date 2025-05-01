import React, { useState } from 'react';

const RecommendationCard = ({ recommendation }) => {
  const [expanded, setExpanded] = useState(false);

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

  // Limit the number of content ideas shown initially
  const displayIdeas = expanded ? contentIdeas : contentIdeas.slice(0, 3);
  const hasMoreIdeas = contentIdeas.length > 3;

  return (
    <div className="card p-6 border-l-4 border-purple-500 transition-all duration-300 hover:translate-y-[-4px]">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-primary-800 dark:text-primary-50">Marketing Recommendation</h3>
        <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded-full">
          AI Generated
        </span>
      </div>

      {recommendation.combined_summary && (
        <div className="mb-4">
          <h4 className="font-semibold text-primary-700 dark:text-primary-200">Summary</h4>
          <p className="text-primary-600 dark:text-primary-300 mt-1">{recommendation.combined_summary}</p>
        </div>
      )}

      {contentIdeas.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-primary-700 dark:text-primary-200">Content Ideas</h4>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            {displayIdeas.map((idea, index) => (
              <li key={index} className="text-primary-600 dark:text-primary-300">{idea}</li>
            ))}
          </ul>

          {hasMoreIdeas && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 transition-colors"
            >
              {expanded ? 'Show less' : `Show ${contentIdeas.length - 3} more ideas`}
            </button>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-primary-500 dark:text-primary-400 flex justify-between items-center">
        <p>Created: {new Date(recommendation.created_at).toLocaleDateString()}</p>
        {recommendation.video_ids && (
          <span className="bg-primary-100 dark:bg-primary-700 px-2 py-1 rounded-full text-xs">
            Based on {recommendation.video_ids.length} videos
          </span>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
