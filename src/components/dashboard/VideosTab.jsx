import React, { useState } from 'react';
import VideoCard from '../VideoCard';
import QuerySelector from '../QuerySelector';

const VideosTab = ({ queries, videos, selectedQueryId, setSelectedQueryId }) => {
  const [sortBy, setSortBy] = useState('views'); // Default sort by views

  // Sort videos based on selected criteria
  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
    if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    return 0;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-50">
          Videos Analyzed
          {videos.length > 0 && <span className="ml-2 text-lg font-normal text-primary-500 dark:text-primary-400">({videos.length})</span>}
        </h2>

        {videos.length > 0 && (
          <div className="mt-2 md:mt-0 flex items-center">
            <span className="text-sm text-primary-600 dark:text-primary-300 mr-2">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select text-sm py-1 pr-8"
              >
                <option value="views">Most Views</option>
                <option value="likes">Most Likes</option>
                <option value="newest">Newest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      <QuerySelector
        queries={queries}
        selectedQueryId={selectedQueryId}
        onSelectQuery={setSelectedQueryId}
      />

      {videos.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {videos.length > 9 && (
            <div className="mt-8 text-center">
              <button className="btn btn-primary">
                Load More Videos
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-300 dark:text-primary-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-lg text-primary-600 dark:text-primary-300 mb-2">
              No videos found
            </p>
            <p className="text-primary-500 dark:text-primary-400 mb-4">
              Try selecting a different query or run the workflow to analyze videos.
            </p>
            <button
              onClick={() => window.location.href = '#settings'}
              className="btn btn-primary"
            >
              Run Workflow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosTab;
