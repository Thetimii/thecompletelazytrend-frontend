import React from 'react';
import VideoCard from '../VideoCard';
import QuerySelector from '../QuerySelector';

const VideosTab = ({ queries, videos, selectedQueryId, setSelectedQueryId }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Videos Analyzed</h2>
      
      <QuerySelector
        queries={queries}
        selectedQueryId={selectedQueryId}
        onSelectQuery={setSelectedQueryId}
      />
      
      {videos.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-lg text-primary-500 dark:text-primary-400">
            No videos found. Try selecting a different query or run the workflow to analyze videos.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideosTab;
