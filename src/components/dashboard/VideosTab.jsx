import React, { useState, useEffect } from 'react';
import VideoCard from '../VideoCard';

const VideosTab = ({ queries, videos, videosByQuery, selectedQueryId, setSelectedQueryId }) => {
  // State for new filtering system
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', '24h', '7d', '30d'
  const [sortBy, setSortBy] = useState('created_at'); // 'created_at', 'views', 'likes', 'shares', 'uploaded_at'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Function to filter videos by time period
  const filterVideosByTime = (videos, timeFilter) => {
    if (timeFilter === 'all') return videos;

    const now = new Date();
    const cutoffTime = new Date();

    switch (timeFilter) {
      case '24h':
        cutoffTime.setHours(now.getHours() - 24);
        break;
      case '7d':
        cutoffTime.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffTime.setDate(now.getDate() - 30);
        break;
      default:
        return videos;
    }

    return videos.filter(video => {
      // Use created_at as primary, uploaded_at as fallback
      const videoDate = new Date(video.created_at || video.uploaded_at || video.UPLOADED_AT);
      return videoDate >= cutoffTime;
    });
  };

  // Function to sort videos
  const sortVideos = (videos, sortBy, sortOrder) => {
    return [...videos].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'views':
          aValue = a.views || 0;
          bValue = b.views || 0;
          break;
        case 'likes':
          aValue = a.likes || 0;
          bValue = b.likes || 0;
          break;
        case 'shares':
          aValue = a.shares || 0;
          bValue = b.shares || 0;
          break;
        case 'uploaded_at':
          aValue = new Date(a.uploaded_at || a.UPLOADED_AT || a.created_at);
          bValue = new Date(b.uploaded_at || b.UPLOADED_AT || b.created_at);
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at || a.uploaded_at);
          bValue = new Date(b.created_at || b.uploaded_at);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Function to render videos with new filtering system
  const renderFilteredVideos = () => {
    // Apply time filter first
    let filteredVideos = filterVideosByTime(videos || [], timeFilter);
    
    // Then apply sorting
    filteredVideos = sortVideos(filteredVideos, sortBy, sortOrder);

    if (filteredVideos.length === 0) {
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
              {timeFilter !== 'all' 
                ? `No videos found in the selected time period. Try expanding the time range or run the workflow to analyze more videos.`
                : "Run the workflow in the Settings tab to analyze TikTok videos for your business."}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="transition-all duration-500">
        <div className="mb-4 text-sm text-primary-600 dark:text-primary-400">
          Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} 
          {timeFilter !== 'all' && ` from ${getTimeFilterLabel(timeFilter)}`}
          {` sorted by ${getSortLabel(sortBy)} (${sortOrder === 'desc' ? 'highest to lowest' : 'lowest to highest'})`}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video, index) => (
            <div
              key={video.id || index}
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

  // Helper functions for labels
  const getTimeFilterLabel = (filter) => {
    switch (filter) {
      case '24h': return 'the last 24 hours';
      case '7d': return 'the last 7 days';
      case '30d': return 'the last 30 days';
      default: return 'all time';
    }
  };

  const getSortLabel = (sort) => {
    switch (sort) {
      case 'views': return 'views';
      case 'likes': return 'likes';
      case 'shares': return 'shares';
      case 'uploaded_at': return 'upload date';
      case 'created_at': return 'analysis date';
      default: return 'date';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold gradient-text">Videos Analyzed</h2>
      </div>

      <div className="dashboard-card mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-primary-800 dark:text-primary-100">
          <svg className="h-5 w-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          <span>Filter & Sort Videos</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Time Period
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-primary-700 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-primary-900 dark:text-primary-100"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-primary-700 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-primary-900 dark:text-primary-100"
            >
              <option value="created_at">Analysis Date</option>
              <option value="uploaded_at">Upload Date</option>
              <option value="views">Views</option>
              <option value="likes">Likes</option>
              <option value="shares">Shares</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-primary-700 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-primary-900 dark:text-primary-100"
            >
              <option value="desc">Highest to Lowest</option>
              <option value="asc">Lowest to Highest</option>
            </select>
          </div>
        </div>
      </div>

      {renderFilteredVideos()}
    </div>
  );
};

export default VideosTab;
