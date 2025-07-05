import React, { useState, useEffect, useRef } from 'react';
import { getLatestRecommendationByUserId } from '../../services/supabaseService';
import {
  formatContentIdeas,
  formatSummary,
  formatTextToJsx,
  formatSampleScriptToJsx,
  formatHashtagStrategyToJsx
} from '../../utils/textFormatters.jsx';

const RecommendationsTab = ({ userProfile, onRefresh }) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Use a ref to track if we've already fetched data
  const hasFetchedRef = useRef(false);

  // Store the last user ID to prevent unnecessary refetching
  const lastUserIdRef = useRef(null);

  // Create a ref to track if we've already run the effect
  const hasRunInitialFetchRef = useRef(false);

  // Set a fixed progress value instead of constantly updating
  useEffect(() => {
    if (!recommendation && initialCheckDone && !error) {
      // Just set a fixed progress value of 80% to indicate it's working
      // but not constantly updating
      setAnalysisProgress(80);
    }
  }, [recommendation, initialCheckDone, error]);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchRecommendation = React.useCallback(async (force = false) => {
    // Skip if we're already loading or if we don't have a user ID
    if ((!force && loading) || !userProfile?.id) {
      console.log('Skipping recommendation fetch - already loading or no user ID');
      return;
    }

    // Skip if we've already fetched for this user and we're not forcing a refresh
    if (!force && hasFetchedRef.current && lastUserIdRef.current === userProfile.id && recommendation) {
      console.log('Skipping recommendation fetch - already have data for this user');
      return;
    }

    try {
      console.log('Fetching recommendation for user ID:', userProfile.id);
      setLoading(true);

      // Update our tracking refs
      hasFetchedRef.current = true;
      lastUserIdRef.current = userProfile.id;

      // Use the real user ID, not the auth ID
      const latestRecommendation = await getLatestRecommendationByUserId(userProfile.id);

      console.log('Recommendation fetch result:', latestRecommendation ? 'Found' : 'Not found');

      setRecommendation(latestRecommendation);

      // If we found a recommendation, set progress to 100%
      if (latestRecommendation) {
        setAnalysisProgress(100);
      }
    } catch (err) {
      console.error('Error fetching recommendation:', err);
      setError('Failed to load recommendation data');
    } finally {
      setLoading(false);
      setInitialCheckDone(true);
    }
  }, [userProfile?.id, loading, recommendation]);

  // Handle refresh button click
  const handleRefresh = React.useCallback(() => {
    console.log('Manual refresh triggered');
    // Force refresh our local data
    fetchRecommendation(true);
  }, [fetchRecommendation]);

  // Only fetch data when the component mounts or when userProfile changes
  useEffect(() => {
    if (userProfile?.id) {
      console.log('Initial recommendation fetch for user ID:', userProfile.id);
      fetchRecommendation();
    }
  }, [userProfile?.id, fetchRecommendation]);

  // Get formatted content ideas using our utility function
  const contentIdeas = React.useMemo(() => {
    // First try to get from content_ideas field if it's not empty
    if (recommendation?.content_ideas) {
      const parsedContentIdeas = formatContentIdeas(recommendation.content_ideas);
      if (parsedContentIdeas.length > 0) {
        return parsedContentIdeas;
      }
    }
    
    // If content_ideas is empty or doesn't exist, try to extract from combined_summary JSON
    try {
      const parsed = JSON.parse(recommendation?.combined_summary || '{}');
      if (parsed.contentThemes && Array.isArray(parsed.contentThemes)) {
        // Clean and filter the contentThemes array
        const cleanedThemes = parsed.contentThemes
          .filter(theme => theme && typeof theme === 'string')
          .map(theme => theme.trim())
          .filter(theme => 
            theme.length > 3 && 
            !theme.match(/^[*\-#+\d\.\s]*$/) && // Remove lines that are only formatting chars/numbers
            !theme.includes('###') && // Remove section headers
            !theme.includes('**#') && // Remove bold headers
            theme !== '*' &&
            theme !== '--' &&
            !theme.match(/^\d+\.\s*$/) // Remove numbered list markers
          )
          .map(theme => {
            // Clean up formatting artifacts
            return theme
              .replace(/^\*+\s*/, '') // Remove leading asterisks
              .replace(/\*\*([^*]+)\*\*:?\s*/g, '$1: ') // Convert **text**: to text:
              .replace(/^[\-\*\+]\s*/, '') // Remove leading dashes/asterisks
              .replace(/^[\d\.]+\s*/, '') // Remove leading numbers
              .replace(/^\s*["']/, '') // Remove leading quotes
              .replace(/["']\s*$/, '') // Remove trailing quotes
              .replace(/\s{2,}/g, ' ') // Normalize whitespace
              .trim();
          })
          .filter(theme => theme.length > 10); // Only keep substantial content
          
        return formatContentIdeas(cleanedThemes);
      }
    } catch (e) {
      console.log('Error parsing combined_summary for content ideas:', e);
    }
    
    return [];
  }, [recommendation?.content_ideas, recommendation?.combined_summary]);

  // Get formatted summary using our utility function
  const combinedSummary = React.useMemo(() => {
    if (!recommendation?.combined_summary) return '';
    
    // Try to parse as JSON first to extract key takeaways for summary
    try {
      const parsed = JSON.parse(recommendation.combined_summary);
      if (parsed.keyTakeaways) {
        return formatSummary(parsed.keyTakeaways);
      }
    } catch (e) {
      // If not JSON, use the raw text
    }
    
    return formatSummary(recommendation.combined_summary);
  }, [recommendation?.combined_summary]);

  // --- New Memoized JSX Formatted Sections ---
  const marketingStrategy = React.useMemo(() => {
    if (!recommendation?.combined_summary) return {};
    
    try {
      // Try to parse the combined_summary as JSON
      const parsed = JSON.parse(recommendation.combined_summary);
      
      // If it's an object, return it directly
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
      
      // If it's a string, it might contain the raw content
      return { rawContent: parsed };
    } catch (error) {
      // If parsing fails, treat it as raw content
      console.log('Could not parse combined_summary as JSON, treating as raw text');
      return { rawContent: recommendation.combined_summary };
    }
  }, [recommendation?.combined_summary]);

  const observationsJsx = React.useMemo(() => {
    const observations = marketingStrategy.observations || marketingStrategy.rawContent;
    return observations ? formatTextToJsx(observations, "Observations") : null;
  }, [marketingStrategy]);

  const keyTakeawaysJsx = React.useMemo(() => {
    return marketingStrategy.keyTakeaways ? formatTextToJsx(marketingStrategy.keyTakeaways, "Key Trend Takeaways") : null;
  }, [marketingStrategy]);

  const sampleScriptJsx = React.useMemo(() => {
    return marketingStrategy.sampleScript ? formatSampleScriptToJsx(marketingStrategy.sampleScript) : null;
  }, [marketingStrategy]);

  const technicalSpecificationsJsx = React.useMemo(() => {
    return marketingStrategy.technicalSpecifications ? formatTextToJsx(marketingStrategy.technicalSpecifications, "Technical Specifications") : null;
  }, [marketingStrategy]);

  const contentThemesJsx = React.useMemo(() => {
    // Assuming contentThemes might be an array or a string that formatTextToJsx can handle
    // If it needs specific parsing like formatContentThemesHtml, a new formatContentThemesToJsx would be needed.
    // For now, using formatTextToJsx as a general list/paragraph formatter.
    let themesInput = marketingStrategy.contentThemes;
    if (Array.isArray(themesInput)) themesInput = themesInput.join('\n- '); // Convert array to string for formatTextToJsx
    return themesInput ? formatTextToJsx(themesInput, "General Content Themes") : null;
  }, [marketingStrategy]);

  const hashtagStrategyJsx = React.useMemo(() => {
    return marketingStrategy.hashtagStrategy ? formatHashtagStrategyToJsx(marketingStrategy.hashtagStrategy) : null;
  }, [marketingStrategy]);

  const postingFrequencyJsx = React.useMemo(() => {
    return marketingStrategy.postingFrequency ? formatTextToJsx(marketingStrategy.postingFrequency, "Posting Frequency") : null;
  }, [marketingStrategy]);
  // --- End New Memoized JSX Formatted Sections ---

  // Skip loading state and go straight to content or empty state

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

  // Render loading state
  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold gradient-text">Recommendations</h2>
        </div>
        <div className="dashboard-card p-10 text-center">
          <p className="text-primary-600 dark:text-primary-400">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!recommendation && initialCheckDone) {
    const progressPercent = Math.round(analysisProgress);
    const estimatedMinutesRemaining = Math.max(1, Math.round((100 - progressPercent) / 10));

    return (
      <div className="animate-fade-in">
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold gradient-text">Recommendations</h2>
        </div>
        <div className="dashboard-card p-10 text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="h-8 w-8 text-accent-500 dark:text-accent-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-primary-800 dark:text-primary-100">AI Analysis in Progress</h3>
          <p className="text-primary-600 dark:text-primary-400 max-w-md mx-auto mb-6">
            Our AI is currently analyzing TikTok videos to generate personalized recommendations for your business. Your first report will be ready in approximately {estimatedMinutesRemaining} {estimatedMinutesRemaining === 1 ? 'minute' : 'minutes'}.
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto bg-primary-100 dark:bg-primary-800 rounded-full h-4 mb-6 overflow-hidden">
            <div
              className="bg-accent-500 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="text-sm text-primary-500 dark:text-primary-400 mb-8">
            Analysis progress: {progressPercent}%
          </div>

          <div className="mt-2 p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg border-l-4 border-accent-500 text-left">
            <p className="text-primary-700 dark:text-primary-300">
              <span className="font-bold">What to expect:</span> Once the analysis is complete, you'll receive personalized content recommendations based on trending TikTok videos in your niche. These recommendations will help you create more engaging content for your audience.
            </p>
          </div>

          <div className="mt-6 text-sm text-primary-500 dark:text-primary-400">
            <p>You don't need to refresh the page. Your recommendations will appear automatically when ready.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render recommendation data
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
          {combinedSummary && !combinedSummary.startsWith('{') ? (
            <p className="text-primary-700 dark:text-primary-300 whitespace-pre-line leading-relaxed break-words">
              {combinedSummary}
            </p>
          ) : (
            <p className="text-primary-600 dark:text-primary-400 italic">
              Detailed recommendations are available in the sections below.
            </p>
          )}
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

      {/* --- Detailed Marketing Strategy Sections --- */}
      {observationsJsx && (
        <div className="dashboard-card mb-8">
          <div className="flex items-center mb-6">
            {/* You can add an icon here if you like */}
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Observations</h3>
          </div>
          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
            {observationsJsx}
          </div>
        </div>
      )}

      {keyTakeawaysJsx && (
        <div className="dashboard-card mb-8">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Key Trend Takeaways</h3>
          </div>
          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
            {keyTakeawaysJsx}
          </div>
        </div>
      )}

      {sampleScriptJsx && (
        <div className="dashboard-card mb-8">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Sample TikTok Script</h3>
          </div>
          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
            {sampleScriptJsx}
          </div>
        </div>
      )}

      {technicalSpecificationsJsx && (
        <div className="dashboard-card mb-8">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Technical Specifications</h3>
          </div>
          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
            {technicalSpecificationsJsx}
          </div>
        </div>
      )}

      {contentThemesJsx && (
        <div className="dashboard-card mb-8">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">General Content Themes</h3>
          </div>
          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
            {contentThemesJsx}
          </div>
        </div>
      )}

      {hashtagStrategyJsx && (
        <div className="dashboard-card mb-8">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Hashtag Strategy</h3>
          </div>
          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
            {hashtagStrategyJsx}
          </div>
        </div>
      )}

      {postingFrequencyJsx && (
        <div className="dashboard-card mb-8">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">Posting Frequency</h3>
          </div>
          <div className="bg-white dark:bg-primary-800 p-6 rounded-lg border border-primary-100 dark:border-primary-700">
            {postingFrequencyJsx}
          </div>
        </div>
      )}
      {/* --- End Detailed Marketing Strategy Sections --- */}

      {/* Last Updated */}
      <div className="text-sm text-primary-500 dark:text-primary-400 text-right">
        Last updated: {recommendation && recommendation.created_at ? new Date(recommendation.created_at).toLocaleString() : 'N/A'}
      </div>
    </div>
  );
};

export default RecommendationsTab;
