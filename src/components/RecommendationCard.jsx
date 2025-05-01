import React, { useState } from 'react';

const RecommendationCard = ({ recommendation }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    <div
      className="glass-card p-6 overflow-hidden relative group transition-all duration-500 hover:translate-y-[-8px] hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 dark:bg-purple-600"></div>

      {/* Animated particle effect */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-300/20 to-transparent dark:from-purple-500/10 blur-xl transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className="flex justify-between items-start mb-3 relative z-10">
        <h3 className="font-bold text-lg text-primary-800 dark:text-primary-50 flex items-center">
          <span className="mr-2">💡</span>
          <span className="transition-transform duration-500 group-hover:translate-x-1">Marketing Recommendation</span>
        </h3>
        <span className="text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white dark:from-purple-600 dark:to-purple-700 px-3 py-1 rounded-full shadow-sm">
          AI Generated
        </span>
      </div>

      {recommendation.combined_summary && (
        <div className="mb-6 relative z-10">
          <h4 className="font-semibold text-primary-700 dark:text-primary-200 flex items-center">
            <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/50 mr-2 flex-shrink-0"></span>
            Summary
          </h4>
          <div className="mt-2 pl-6 border-l border-purple-200 dark:border-purple-800/50">
            <p className="text-primary-600 dark:text-primary-300">{recommendation.combined_summary}</p>
          </div>
        </div>
      )}

      {contentIdeas.length > 0 && (
        <div className="mb-6 relative z-10">
          <h4 className="font-semibold text-primary-700 dark:text-primary-200 flex items-center">
            <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/50 mr-2 flex-shrink-0"></span>
            Content Ideas
          </h4>
          <div className="mt-2 pl-6 border-l border-purple-200 dark:border-purple-800/50">
            <ul className="space-y-2">
              {displayIdeas.map((idea, index) => (
                <li
                  key={index}
                  className="text-primary-600 dark:text-primary-300 flex items-start"
                  style={{
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease forwards',
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="text-purple-500 dark:text-purple-400 mr-2">•</span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>

            {hasMoreIdeas && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-sm text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 transition-all duration-300 hover:translate-x-1 flex items-center"
              >
                <span className="mr-1">{expanded ? '↑ Show less' : `↓ Show ${contentIdeas.length - 3} more ideas`}</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-primary-500 dark:text-primary-400 flex justify-between items-center relative z-10">
        <p>Created: {new Date(recommendation.created_at).toLocaleDateString()}</p>
        {recommendation.video_ids && (
          <span className="bg-purple-100/70 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-xs shadow-sm">
            Based on {recommendation.video_ids.length} videos
          </span>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RecommendationCard;
