import Playlist from '../models/Playlist.js';
import Track from '../models/Track.js';
import { getNextTrackInActivePlaylist } from '../utils/streamingControl.js';

// Get all playlists
export const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('tracks');
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlists', error: error.message });
  }
};

// Get playlist by ID
export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('tracks');
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlist', error: error.message });
  }
};

// Get the currently active playlist
export const getActivePlaylist = async (req, res) => {
  try {
    const activePlaylist = await Playlist.findOne({ isActive: true }).populate('tracks');
    
    if (!activePlaylist) {
      return res.status(404).json({ message: 'No active playlist found' });
    }
    
    res.status(200).json(activePlaylist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active playlist', error: error.message });
  }
};

// Set a playlist as active (and deactivate others)
export const setActivePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    
    // Deactivate all playlists
    await Playlist.updateMany({}, { isActive: false });
    
    // Set the requested playlist as active
    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { isActive: true },
      { new: true }
    ).populate('tracks');
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error setting active playlist', error: error.message });
  }
};

// Create new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }
    
    const newPlaylist = new Playlist({
      name,
      description,
      isPublic: isPublic || false,
      tracks: []
    });
    
    const savedPlaylist = await newPlaylist.save();
    res.status(201).json(savedPlaylist);
  } catch (error) {
    res.status(500).json({ message: 'Error creating playlist', error: error.message });
  }
};

// Update playlist
export const updatePlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      req.params.id,
      { name, description, isPublic, updatedAt: Date.now() },
      { new: true }
    ).populate('tracks');
    
    if (!updatedPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: 'Error updating playlist', error: error.message });
  }
};

// Delete playlist
export const deletePlaylist = async (req, res) => {
  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);
    
    if (!deletedPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting playlist', error: error.message });
  }
};

// Add track to playlist
export const addTrackToPlaylist = async (req, res) => {
  try {
    const { trackId } = req.body;
    
    if (!trackId) {
      return res.status(400).json({ message: 'Track ID is required' });
    }
    
    // Check if track exists
    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    
    // Update playlist with new track
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if track is already in playlist
    if (playlist.tracks.includes(trackId)) {
      return res.status(400).json({ message: 'Track already exists in playlist' });
    }
    
    playlist.tracks.push(trackId);
    playlist.updatedAt = Date.now();
    
    const updatedPlaylist = await playlist.save();
    await updatedPlaylist.populate('tracks');
    
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding track to playlist', error: error.message });
  }
};

// Remove track from playlist
export const removeTrackFromPlaylist = async (req, res) => {
  try {
    const { trackId } = req.params;
    
    // Find playlist and remove track
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Remove track from playlist
    playlist.tracks = playlist.tracks.filter(track => track.toString() !== trackId);
    playlist.updatedAt = Date.now();
    
    const updatedPlaylist = await playlist.save();
    await updatedPlaylist.populate('tracks');
    
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: 'Error removing track from playlist', error: error.message });
  }
};

// Get next track from active playlist
export const getNextTrack = async (req, res) => {
  try {
    const { currentTrackId } = req.params;
    
    if (!currentTrackId) {
      return res.status(400).json({ message: 'Current track ID is required' });
    }
    
    const nextTrack = await getNextTrackInActivePlaylist(currentTrackId);
    
    if (!nextTrack) {
      return res.status(404).json({ message: 'No next track found or no active playlist' });
    }
    
    res.status(200).json(nextTrack);
  } catch (error) {
    res.status(500).json({ message: 'Error getting next track', error: error.message });
  }
};

// Get current track from active playlist (first track if none is specified)
export const getCurrentTrack = async (req, res) => {
  try {
    const activePlaylist = await Playlist.findOne({ isActive: true }).populate('tracks');
    
    if (!activePlaylist || !activePlaylist.tracks.length) {
      return res.status(404).json({ message: 'No active playlist found or playlist is empty' });
    }
    
    // Return the first track by default
    const currentTrack = activePlaylist.tracks[0];
    
    res.status(200).json(currentTrack);
  } catch (error) {
    res.status(500).json({ message: 'Error getting current track', error: error.message });
  }
};

export default {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getActivePlaylist,
  setActivePlaylist,
  getNextTrack,
  getCurrentTrack
}; 