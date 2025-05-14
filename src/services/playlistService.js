// API service for playlist management and streaming

// Base API URL
const API_URL = '/api';

// Get all playlists
export const getPlaylists = async () => {
  try {
    const response = await fetch(`${API_URL}/playlists`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};

// Create a new playlist
export const createPlaylist = async (playlistData) => {
  try {
    const response = await fetch(`${API_URL}/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playlistData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

// Add a track to a playlist
export const addTrackToPlaylist = async (playlistId, trackId) => {
  try {
    const response = await fetch(`${API_URL}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trackId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    throw error;
  }
};

// Create a track from YouTube ID
export const createTrack = async (youtubeId) => {
  try {
    const response = await fetch(`${API_URL}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtubeId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating track:', error);
    throw error;
  }
};

// Search YouTube for videos
export const searchYouTube = async (query) => {
  try {
    const response = await fetch(`${API_URL}/tracks/search/youtube?query=${encodeURIComponent(query)}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
};

// Streaming controls
// =================

// Get active playlist
export const getActivePlaylist = async () => {
  try {
    const response = await fetch(`${API_URL}/playlists/active`);
    if (response.status === 404) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching active playlist:', error);
    return null;
  }
};

// Set a playlist as active
export const setActivePlaylist = async (playlistId) => {
  try {
    const response = await fetch(`${API_URL}/playlists/${playlistId}/activate`, {
      method: 'PUT',
    });
    return await response.json();
  } catch (error) {
    console.error('Error setting active playlist:', error);
    throw error;
  }
};

// Get current track from active playlist
export const getCurrentTrack = async () => {
  try {
    const response = await fetch(`${API_URL}/playlists/active/track`);
    if (response.status === 404) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching current track:', error);
    return null;
  }
};

// Get next track to play
export const getNextTrack = async (currentTrackId) => {
  try {
    const response = await fetch(`${API_URL}/playlists/active/track/${currentTrackId}/next`);
    if (response.status === 404) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching next track:', error);
    return null;
  }
};

export default {
  getPlaylists,
  createPlaylist,
  addTrackToPlaylist,
  createTrack,
  searchYouTube,
  getActivePlaylist,
  setActivePlaylist,
  getCurrentTrack,
  getNextTrack
}; 