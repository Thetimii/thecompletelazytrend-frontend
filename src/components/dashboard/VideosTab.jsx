import React, { useState } from 'react';
import VideoCard from '../VideoCard';
import QuerySelector from '../QuerySelector';

const VideosTab = ({ queries, videos, videosByQuery, selectedQueryId, setSelectedQueryId }) => {
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'filtered'

  console.log('VideosTab props:', {
    queriesCount: queries?.length || 0,
    videosCount: videos?.length || 0,
    videosByQueryCount: videosByQuery?.length || 0,
    selectedQueryId
  });

  // Function to render videos in filtered mode (using the existing filter dropdown)
  const renderFilteredVideos = () => {
    if (videos.length === 0) {
      return (
        <div className="dashboard-card p-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary-800 dark:text-primary-100">No Videos Found</h3>
            <p className="text-primary-600 dark:text-primary-400 max-w-md mx-auto">
              Try selecting a different query or run the workflow in the Settings tab to analyze TikTok videos.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="transition-all duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="animate-slide-up"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to render videos grouped by search query
  const renderGroupedVideos = () => {
    console.log('Rendering grouped videos with data:', videosByQuery);

    if (!videosByQuery || videosByQuery.length === 0) {
      return (
        <div className="dashboard-card p-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary-800 dark:text-primary-100">No Videos Found</h3>
            <p className="text-primary-600 dark:text-primary-400 max-w-md mx-auto">
              Run the workflow in the Settings tab to analyze TikTok videos for your business.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-12">
        {videosByQuery.map((queryGroup, groupIndex) => (
          <div key={queryGroup.queryId} className="animate-fade-in" style={{ animationDelay: `${groupIndex * 0.2}s` }}>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100 flex items-center">
                <svg className="h-5 w-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                </svg>
                <span>Search: "{queryGroup.queryText}"</span>
              </h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 ml-7">
                {queryGroup.videos.length} video{queryGroup.videos.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {queryGroup.videos.map((video, videoIndex) => (
                <div
                  key={video.id}
                  className="animate-slide-up"
                  style={{
                    animationDelay: `${videoIndex * 0.1}s`
                  }}
                >
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold gradient-text">Videos Analyzed</h2>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grouped')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grouped'
                ? 'bg-accent-500 text-white'
                : 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700'
            }`}
          >
            Grouped by Search
          </button>
          <button
            onClick={() => setViewMode('filtered')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'filtered'
                ? 'bg-accent-500 text-white'
                : 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700'
            }`}
          >
            Filter by Search
          </button>
        </div>
      </div>

      {viewMode === 'filtered' && (
        <div className="dashboard-card mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-primary-800 dark:text-primary-100">
            <svg className="h-5 w-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            <span>Filter Videos</span>
          </h3>
          <QuerySelector
            queries={queries}
            selectedQueryId={selectedQueryId}
            onSelectQuery={setSelectedQueryId}
          />
        </div>
      )}

      {viewMode === 'filtered' ? renderFilteredVideos() : renderGroupedVideos()}
    </div>
  );
};

export default VideosTab;
