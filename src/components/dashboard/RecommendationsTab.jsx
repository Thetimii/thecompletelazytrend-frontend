import React, { useState, useEffect } from 'react';
import { getLatestRecommendationByUserId } from '../../services/supabaseService';

const RecommendationsTab = ({ userProfile }) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        if (userProfile?.id) {
          // Use the real user ID, not the auth ID
          const latestRecommendation = await getLatestRecommendationByUserId(userProfile.id);
          setRecommendation(latestRecommendation);
        }
      } catch (err) {
        console.error('Error fetching recommendation:', err);
        setError('Failed to load recommendation data');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [userProfile]);

  // Parse content ideas from JSON string if needed
  const getContentIdeas = () => {
    if (!recommendation?.content_ideas) return [];
    
    try {
      if (typeof recommendation.content_ideas === 'string') {
        return JSON.parse(recommendation.content_ideas);
      }
      return recommendation.content_ideas;
    } catch (err) {
      console.error('Error parsing content ideas:', err);
      return [];
    }
  };

  // Parse combined summary from JSON string if needed
  const getCombinedSummary = () => {
    if (!recommendation?.combined_summary) return '';
    
    try {
      if (typeof recommendation.combined_summary === 'string') {
        return recommendation.combined_summary;
      }
      return JSON.stringify(recommendation.combined_summary);
    } catch (err) {
      console.error('Error parsing combined summary:', err);
      return '';
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold gradient-text">Recommendations</h2>
        </div>
        <div className="dashboard-card p-10 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-accent-500"></div>
          <span className="ml-3 text-primary-600 dark:text-primary-400">Loading recommendations...</span>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold gradient-text">Recommendations</h2>
        </div>
        <div className="dashboard-card p-10 text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-primary-800 dark:text-primary-100">Error Loading Recommendations</h3>
          <p className="text-primary-600 dark:text-primary-400">{error}</p>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!recommendation) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold gradient-text">Recommendations</h2>
        </div>
        <div className="dashboard-card p-10 text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="h-8 w-8 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-primary-800 dark:text-primary-100">No Recommendations Yet</h3>
          <p className="text-primary-600 dark:text-primary-400 max-w-md mx-auto">
            We haven't generated any recommendations for your business yet. Go to the Settings tab to run the workflow and analyze TikTok videos.
          </p>
        </div>
      </div>
    );
  }

  // Render recommendation data
  const contentIdeas = getContentIdeas();
  const combinedSummary = getCombinedSummary();
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8">
        <h2 className="text-3xl font-bold gradient-text">Recommendations</h2>
      </div>

      {/* Trend Summary */}
      <div className="dashboard-card mb-8">
        <div className="flex items-center mb-6">
          <svg className="h-6 w-6 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Trend Summary</h3>
        </div>
        
        <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
          <p className="text-primary-700 dark:text-primary-300 whitespace-pre-line">
            {combinedSummary}
          </p>
        </div>
      </div>

      {/* Content Ideas */}
      <div className="dashboard-card mb-8">
        <div className="flex items-center mb-6">
          <svg className="h-6 w-6 text-accent-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Content Ideas</h3>
        </div>
        
        <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
          {Array.isArray(contentIdeas) && contentIdeas.length > 0 ? (
            <ul className="space-y-4">
              {contentIdeas.map((idea, index) => (
                <li key={index} className="flex">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 flex items-center justify-center mr-3 font-medium">
                    {index + 1}
                  </span>
                  <p className="text-primary-700 dark:text-primary-300">{idea}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-primary-600 dark:text-primary-400 italic">No content ideas available</p>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-primary-500 dark:text-primary-400 text-right">
        Last updated: {new Date(recommendation.created_at).toLocaleString()}
      </div>
    </div>
  );
};

export default RecommendationsTab;
