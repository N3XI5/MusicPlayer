import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

/**
 * Get video details from YouTube API
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} - Video details
 */
export const getVideoDetails = async (videoId) => {
  try {
    const response = await youtube.videos.list({
      part: 'snippet,contentDetails,statistics',
      id: videoId
    });

    if (response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = response.data.items[0];
    const { snippet, contentDetails, statistics } = video;

    // Parse duration from ISO 8601 format
    const duration = parseDuration(contentDetails.duration);

    return {
      youtubeId: videoId,
      title: snippet.title,
      artist: snippet.channelTitle,
      image: snippet.thumbnails.maxres?.url || 
             snippet.thumbnails.high?.url || 
             snippet.thumbnails.medium?.url || 
             snippet.thumbnails.default?.url,
      duration,
      metadata: {
        views: parseInt(statistics.viewCount, 10),
        likes: parseInt(statistics.likeCount, 10),
        publishedAt: new Date(snippet.publishedAt),
        channelId: snippet.channelId,
        channelTitle: snippet.channelTitle,
        description: snippet.description
      }
    };
  } catch (error) {
    console.error('YouTube API Error:', error);
    throw error;
  }
};

/**
 * Search for videos on YouTube
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Array>} - List of search results
 */
export const searchVideos = async (query, maxResults = 10) => {
  try {
    const response = await youtube.search.list({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults
    });

    return response.data.items.map(item => ({
      youtubeId: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      image: item.snippet.thumbnails.high?.url || 
             item.snippet.thumbnails.medium?.url || 
             item.snippet.thumbnails.default?.url,
      addedAt: new Date(),
      metadata: {
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt),
        description: item.snippet.description
      }
    }));
  } catch (error) {
    console.error('YouTube Search API Error:', error);
    throw error;
  }
};

/**
 * Parse ISO 8601 duration to seconds
 * @param {string} isoDuration - Duration in ISO 8601 format
 * @returns {number} - Duration in seconds
 */
const parseDuration = (isoDuration) => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (match[1] && parseInt(match[1], 10)) || 0;
  const minutes = (match[2] && parseInt(match[2], 10)) || 0;
  const seconds = (match[3] && parseInt(match[3], 10)) || 0;
  
  return hours * 3600 + minutes * 60 + seconds;
};

export default {
  getVideoDetails,
  searchVideos
}; 