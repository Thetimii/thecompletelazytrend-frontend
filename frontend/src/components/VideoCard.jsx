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

  // Get thumbnail URL - try all possible fields
  let thumbnailUrl = '';

  // Check for direct image URLs in various fields
  if (video.thumbnail_url) thumbnailUrl = video.thumbnail_url;
  else if (video.cover_url) thumbnailUrl = video.cover_url;
  else if (video.thumbnail) thumbnailUrl = video.thumbnail;
  else if (video.cover) thumbnailUrl = video.cover;

  // If we have a video URL but no thumbnail, try to extract from the video URL
  if ((!thumbnailUrl || thumbnailUrl.includes('undefined')) && video.video_url) {
    // TikTok video URLs often contain the video ID which can be used to construct a thumbnail URL
    const videoIdMatch = video.video_url.match(/\/video\/(\d+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1];
      // Try different TikTok CDN patterns
      thumbnailUrl = `https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/${videoId}~c5_720x720.jpeg`;

      // If the video ID is available, we can also try to use the TikTok API to get the thumbnail
      // This is a fallback in case the direct CDN URL doesn't work
      if (!thumbnailUrl || thumbnailUrl.includes('undefined')) {
        thumbnailUrl = `https://www.tiktok.com/api/img/?itemId=${videoId}&location=0`;
      }
    }
  }

  // Fallback to a generic TikTok thumbnail if we still don't have one
  if (!thumbnailUrl || thumbnailUrl.includes('undefined')) {
    // Use a placeholder image for TikTok
    thumbnailUrl = 'https://p16-sign-va.tiktokcdn.com/musically-maliva-obj/1645136815763462~c5_720x720.jpeg';
  }

  // If the URL doesn't start with http, it might be a relative URL
  // Try to fix it by adding the TikTok domain if needed
  if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
    if (thumbnailUrl.startsWith('//')) {
      thumbnailUrl = 'https:' + thumbnailUrl;
    } else if (thumbnailUrl.startsWith('/')) {
      thumbnailUrl = 'https://www.tiktok.com' + thumbnailUrl;
    }
  }

  // Thumbnail info is now properly processed

  // Get engagement metrics with fallbacks
  const views = video.views || video.play_count || 0;
  const likes = video.likes || video.like_count || 0;
  const comments = video.comments || video.comment_count || 0;
  const shares = video.shares || video.share_count || 0;

  return (
    <div
      className="glass-card overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Thumbnail */}
      <div className="relative pb-[56.25%] overflow-hidden bg-primary-100 dark:bg-primary-800">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={(video.caption || video.description)?.substring(0, 30) || 'Video thumbnail'}
            className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-12 w-12 text-primary-300 dark:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}

        {/* Gradient overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Views badge */}
        <div className="absolute top-2 right-2 bg-primary-900/60 backdrop-blur-sm text-primary-50 text-xs px-2 py-1 rounded-full shadow-md">
          {views > 0 ? `${views.toLocaleString()} views` : 'No views'}
        </div>

        {/* Play button that appears on hover */}
        {(video.download_url || video.video_url) && (
          <a
            href={video.download_url || video.video_url}
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

        {/* Engagement metrics */}
        <div className="flex flex-wrap gap-3 mt-3 text-sm text-primary-500 dark:text-primary-400 relative z-10">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {views.toLocaleString()}
          </span>

          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likes.toLocaleString()}
          </span>

          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {comments.toLocaleString()}
          </span>

          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {shares.toLocaleString()}
          </span>
        </div>

        {/* Link to original */}
        <div className="flex justify-end mt-3">
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
  );
};

export default VideoCard;
