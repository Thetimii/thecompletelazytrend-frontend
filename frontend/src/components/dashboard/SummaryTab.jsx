import React, { useState, useEffect } from 'react';
import StatCard from '../StatCard';
import { getLatestRecommendationByUserId } from '../../services/supabaseService';
import { formatSummary } from '../../utils/textFormatters';

const SummaryTab = ({ queries, videos, recommendations, userProfile, onTabChange, onRefresh }) => {
  const [latestRecommendation, setLatestRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Set a fixed progress value instead of constantly updating
  useEffect(() => {
    if (!latestRecommendation && initialCheckDone) {
      // Just set a fixed progress value of 80% to indicate it's working
      // but not constantly updating
      setAnalysisProgress(80);
    }
  }, [latestRecommendation, initialCheckDone]);

  useEffect(() => {
    const fetchLatestRecommendation = async () => {
      try {
        setLoading(true);
        if (userProfile?.id) {
          const latest = await getLatestRecommendationByUserId(userProfile.id);
          setLatestRecommendation(latest);

          // If we found a recommendation, set progress to 100%
          if (latest) {
            setAnalysisProgress(100);
          }
        }
      } catch (err) {
        console.error('Error fetching latest recommendation:', err);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    fetchLatestRecommendation();
    // Don't poll for updates - just check once when the component mounts
  }, [userProfile]);
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

      {/* Latest Recommendation */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100 flex items-center">
            <svg className="h-5 w-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            Latest Marketing Recommendation
          </h3>
        </div>

        {latestRecommendation ? (
          <div className="dashboard-card p-6">
            <div className="flex flex-col">
              {/* Summary section */}
              <div className="mb-6">
                <h4 className="font-semibold text-primary-700 dark:text-primary-200 flex items-center mb-3">
                  <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/50 mr-2 flex-shrink-0"></span>
                  Trend Summary
                </h4>
                <div className="bg-white dark:bg-primary-800 p-4 rounded-lg border border-primary-100 dark:border-primary-700 mb-4">
                  <p className="text-primary-700 dark:text-primary-300 whitespace-pre-line leading-relaxed line-clamp-4">
                    {formatSummary(latestRecommendation.combined_summary)}
                  </p>
                </div>
              </div>

              {/* Button to view full recommendations */}
              <div className="flex justify-center">
                <button
                  onClick={() => onTabChange('recommendations')}
                  className="btn btn-primary px-6 py-2"
                >
                  View Full Recommendations
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-card p-10 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="h-8 w-8 text-accent-500 dark:text-accent-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary-800 dark:text-primary-100">AI Analysis in Progress</h3>

            {initialCheckDone && (
              <>
                <p className="text-primary-600 dark:text-primary-400 max-w-md mx-auto mb-6">
                  Our AI is analyzing TikTok videos to generate your first recommendation. This will be ready in approximately {Math.max(1, Math.round((100 - Math.round(analysisProgress)) / 10))} {Math.round((100 - analysisProgress) / 10) === 1 ? 'minute' : 'minutes'}.
                </p>

                {/* Progress bar */}
                <div className="w-full max-w-md mx-auto bg-primary-100 dark:bg-primary-800 rounded-full h-4 mb-4 overflow-hidden">
                  <div
                    className="bg-accent-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.round(analysisProgress)}%` }}
                  ></div>
                </div>

                <div className="text-sm text-primary-500 dark:text-primary-400 mb-4">
                  Analysis progress: {Math.round(analysisProgress)}%
                </div>

                {/* Refresh button */}
                <button
                  onClick={onRefresh}
                  className="mt-4 btn btn-secondary px-6 py-2 flex items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Check for Updates
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryTab;
