import React from 'react';
import VideoCard from '../VideoCard';
import QuerySelector from '../QuerySelector';

const VideosTab = ({ queries, videos, selectedQueryId, setSelectedQueryId }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">Videos Analyzed</h2>
        <div className="ml-3 h-1 flex-grow bg-gradient-to-r from-green-500 to-transparent rounded-full"></div>
      </div>

      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">🔍</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="transform transition-all duration-500"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  animation: 'fadeInUp 0.5s ease forwards',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 text-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-4">🎬</span>
            <p className="text-lg text-primary-500 dark:text-primary-400">
              No videos found. Try selecting a different query or run the workflow to analyze videos.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default VideosTab;
