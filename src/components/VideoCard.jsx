import React from 'react';

const VideoCard = ({ video }) => {
  // Extract hashtags from description if available
  const extractHashtags = (text) => {
    if (!text) return [];
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = text.match(hashtagRegex);
    return matches || [];
  };

  // Parse hashtags from the database or extract from caption
  const hashtags = video.hashtags || extractHashtags(video.description || video.caption);

  // Get thumbnail URL
  const thumbnailUrl = video.thumbnail_url || video.cover_url || '';

  return (
    <div className="card overflow-hidden transition-all duration-300 hover:translate-y-[-4px]">
      {thumbnailUrl && (
        <div className="relative pb-[56.25%] overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={(video.caption || video.description)?.substring(0, 30) || 'Video thumbnail'}
            className="absolute h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            {video.views ? `${video.views.toLocaleString()} views` : 'No views'}
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200 text-xs font-medium px-2.5 py-0.5 rounded">TikTok</span>
          {hashtags && hashtags.length > 0 && (
            <span className="ml-2 text-xs text-primary-500 dark:text-primary-400 truncate max-w-[200px]">
              {typeof hashtags === 'string' ? hashtags : hashtags.slice(0, 3).join(', ')}
            </span>
          )}
        </div>
        <p className="text-primary-600 dark:text-primary-300 text-sm mt-1 line-clamp-3">
          {video.caption || video.description || 'No caption'}
        </p>
        <div className="flex justify-between mt-3 text-sm text-primary-500 dark:text-primary-400">
          <div className="flex space-x-3">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {video.likes?.toLocaleString() || 0}
            </span>
            {video.downloads > 0 && (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {video.downloads}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {/* Use download_url from database */}
            {video.download_url && (
              <a
                href={video.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 transition-colors"
              >
                Watch
              </a>
            )}
            {/* Use video_url from database */}
            {video.video_url && (
              <a
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 transition-colors"
              >
                Original
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
