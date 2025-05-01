import React, { useState } from 'react';

const VideoCard = ({ video }) => {
  const [imageError, setImageError] = useState(false);

  // Extract hashtags from description if available
  const extractHashtags = (text) => {
    if (!text) return [];
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = text.match(hashtagRegex);
    return matches || [];
  };

  // Parse hashtags from the database or extract from caption
  const hashtags = video.hashtags || extractHashtags(video.description || video.caption);

  // Get thumbnail URL or use a fallback
  const thumbnailUrl = video.thumbnail_url || video.cover_url || video.videoUrl || video.download_url || '';

  // Fallback image for when thumbnail is missing or fails to load
  const fallbackImage = 'https://placehold.co/600x400/3b82f6/ffffff?text=TikTok+Video';

  // Format numbers with K, M suffix
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="card overflow-hidden transition-all duration-300 hover:translate-y-[-4px] shadow-md hover:shadow-lg">
      <div className="relative pb-[56.25%] overflow-hidden bg-gradient-to-r from-accent-100 to-accent-200 dark:from-accent-900 dark:to-accent-800">
        <img
          src={imageError ? fallbackImage : thumbnailUrl || fallbackImage}
          alt={(video.caption || video.description)?.substring(0, 30) || 'TikTok video'}
          className="absolute h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          onError={handleImageError}
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
          {video.views ? `${formatNumber(video.views)} views` : 'No views'}
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-accent-500 bg-opacity-80 flex items-center justify-center text-white transition-transform duration-300 transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200 text-xs font-medium px-2.5 py-0.5 rounded">TikTok</span>
          {hashtags && hashtags.length > 0 && (
            <span className="ml-2 text-xs text-primary-500 dark:text-primary-400 truncate max-w-[200px]">
              {typeof hashtags === 'string' ? hashtags : hashtags.slice(0, 3).join(', ')}
            </span>
          )}
        </div>

        <p className="text-primary-600 dark:text-primary-300 text-sm mt-1 line-clamp-3 min-h-[3em]">
          {video.caption || video.description || 'No caption available'}
        </p>

        <div className="flex justify-between mt-3 text-sm text-primary-500 dark:text-primary-400">
          <div className="flex space-x-3">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {formatNumber(video.likes || 0)}
            </span>
            {(video.downloads > 0 || video.comments > 0) && (
              <span className="flex items-center">
                {video.downloads > 0 ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {formatNumber(video.downloads)}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {formatNumber(video.comments)}
                  </>
                )}
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            {/* Watch button - use any available URL */}
            {(video.download_url || video.video_url || video.videoUrl) && (
              <a
                href={video.download_url || video.video_url || video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary py-1 px-3 text-xs"
              >
                Watch
              </a>
            )}

            {/* Original button - only if we have the original TikTok URL */}
            {video.video_url && video.video_url.includes('tiktok.com') && (
              <a
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary py-1 px-3 text-xs"
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
