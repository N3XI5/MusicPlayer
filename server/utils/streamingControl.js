import Playlist from '../models/Playlist.js';

/**
 * Returns the currently active playlist with all track data
 * @returns {Promise<Object|null>} - Active playlist or null if none is set
 */
export const getActivePlaylistWithTracks = async () => {
  try {
    return await Playlist.findOne({ isActive: true }).populate('tracks');
  } catch (error) {
    console.error('Error fetching active playlist:', error);
    return null;
  }
};

/**
 * Sets a playlist as the active one for streaming
 * @param {string} playlistId - ID of the playlist to activate
 * @returns {Promise<Object|null>} - Activated playlist or null on error
 */
export const activatePlaylist = async (playlistId) => {
  try {
    // Deactivate all playlists
    await Playlist.updateMany({}, { isActive: false });
    
    // Set the requested playlist as active
    return await Playlist.findByIdAndUpdate(
      playlistId,
      { isActive: true },
      { new: true }
    ).populate('tracks');
  } catch (error) {
    console.error('Error activating playlist:', error);
    return null;
  }
};

/**
 * Get the next track in an active playlist
 * @param {string} currentTrackId - ID of the current track
 * @returns {Promise<Object|null>} - Next track or null if no more tracks
 */
export const getNextTrackInActivePlaylist = async (currentTrackId) => {
  try {
    const activePlaylist = await Playlist.findOne({ isActive: true }).populate('tracks');
    
    if (!activePlaylist || !activePlaylist.tracks.length) {
      return null;
    }
    
    const currentIndex = activePlaylist.tracks.findIndex(
      track => track._id.toString() === currentTrackId
    );
    
    // If current track not found or it's the last track, return the first track (loop)
    if (currentIndex === -1 || currentIndex === activePlaylist.tracks.length - 1) {
      return activePlaylist.tracks[0];
    }
    
    // Return next track
    return activePlaylist.tracks[currentIndex + 1];
  } catch (error) {
    console.error('Error getting next track:', error);
    return null;
  }
};

export default {
  getActivePlaylistWithTracks,
  activatePlaylist,
  getNextTrackInActivePlaylist
}; 