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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {thumbnailUrl && (
        <div className="relative pb-[56.25%]">
          <img
            src={thumbnailUrl}
            alt={(video.caption || video.description)?.substring(0, 30) || 'Video thumbnail'}
            className="absolute h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">TikTok</span>
          {hashtags && hashtags.length > 0 && (
            <span className="ml-2 text-xs text-gray-500 truncate max-w-[200px]">
              {typeof hashtags === 'string' ? hashtags : hashtags.slice(0, 3).join(', ')}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mt-1 line-clamp-3">
          {video.caption || video.description || 'No caption'}
        </p>
        <div className="flex justify-between mt-3 text-sm text-gray-500">
          <div>
            <span className="mr-2">👁️ {video.views || 0}</span>
            <span className="mr-2">❤️ {video.likes || 0}</span>
            {video.downloads > 0 && <span>⬇️ {video.downloads}</span>}
          </div>
          <div className="flex space-x-2">
            {/* Use download_url from database */}
            {video.download_url && (
              <a
                href={video.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
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
                className="text-blue-500 hover:underline"
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
