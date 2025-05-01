import React from 'react';
import VideoCard from '../VideoCard';
import QuerySelector from '../QuerySelector';

const VideosTab = ({ queries, videos, selectedQueryId, setSelectedQueryId }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8">
        <h2 className="text-3xl font-bold gradient-text">Videos Analyzed</h2>
      </div>

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

      {videos.length > 0 ? (
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
      ) : (
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
      )}
    </div>
  );
};

export default VideosTab;
