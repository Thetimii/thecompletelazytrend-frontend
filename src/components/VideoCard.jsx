import React, { useState } from 'react';

const VideoCard = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);

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
    <div
      className="glass-card overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {thumbnailUrl && (
        <div className="relative pb-[56.25%] overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={(video.caption || video.description)?.substring(0, 30) || 'Video thumbnail'}
            className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient overlay that appears on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Views badge */}
          <div className="absolute top-2 right-2 bg-primary-900/60 backdrop-blur-sm text-primary-50 text-xs px-2 py-1 rounded-full shadow-md">
            {video.views ? `${video.views.toLocaleString()} views` : 'No views'}
          </div>

          {/* Play button that appears on hover */}
          {video.download_url && (
            <a
              href={video.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            >
              <div className="w-16 h-16 rounded-full bg-primary-50/30 dark:bg-primary-800/30 backdrop-blur-sm flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-50 dark:text-primary-50" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </a>
          )}
        </div>
      )}

      <div className="p-4 relative">
        {/* Animated particle effect */}
        <div className={`absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-accent-300/20 to-transparent dark:from-accent-500/10 blur-xl transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className="flex items-center mb-2 relative z-10">
          <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white dark:from-accent-600 dark:to-accent-700 text-xs font-medium px-2.5 py-1 rounded shadow-sm">TikTok</span>
          {hashtags && hashtags.length > 0 && (
            <span className="ml-2 text-xs text-primary-500 dark:text-primary-400 truncate max-w-[200px]">
              {typeof hashtags === 'string' ? hashtags : hashtags.slice(0, 3).join(', ')}
            </span>
          )}
        </div>

        <p className="text-primary-600 dark:text-primary-300 text-sm mt-1 line-clamp-3 relative z-10">
          {video.caption || video.description || 'No caption'}
        </p>

        <div className="flex justify-between mt-3 text-sm text-primary-500 dark:text-primary-400 relative z-10">
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
            {/* Use video_url from database */}
            {video.video_url && (
              <a
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 transition-colors hover:underline"
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
