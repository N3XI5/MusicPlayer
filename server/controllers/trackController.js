import Track from '../models/Track.js';
import { getVideoDetails, searchVideos } from '../utils/youtubeApi.js';

// Get all tracks
export const getTracks = async (req, res) => {
  try {
    const tracks = await Track.find().sort({ addedAt: -1 });
    res.status(200).json(tracks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tracks', error: error.message });
  }
};

// Get track by ID
export const getTrackById = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    res.status(200).json(track);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching track', error: error.message });
  }
};

// Create track from YouTube ID
export const createTrack = async (req, res) => {
  try {
    const { youtubeId } = req.body;
    
    if (!youtubeId) {
      return res.status(400).json({ message: 'YouTube ID is required' });
    }
    
    // Check if track already exists
    const existingTrack = await Track.findOne({ youtubeId });
    if (existingTrack) {
      return res.status(200).json(existingTrack);
    }
    
    // Fetch track data from YouTube API
    const trackData = await getVideoDetails(youtubeId);
    
    // Create and save new track
    const newTrack = new Track(trackData);
    const savedTrack = await newTrack.save();
    
    res.status(201).json(savedTrack);
  } catch (error) {
    res.status(500).json({ message: 'Error creating track', error: error.message });
  }
};

// Update track
export const updateTrack = async (req, res) => {
  try {
    const { title, artist, image } = req.body;
    
    const updatedTrack = await Track.findByIdAndUpdate(
      req.params.id,
      { title, artist, image },
      { new: true }
    );
    
    if (!updatedTrack) {
      return res.status(404).json({ message: 'Track not found' });
    }
    
    res.status(200).json(updatedTrack);
  } catch (error) {
    res.status(500).json({ message: 'Error updating track', error: error.message });
  }
};

// Delete track
export const deleteTrack = async (req, res) => {
  try {
    const deletedTrack = await Track.findByIdAndDelete(req.params.id);
    
    if (!deletedTrack) {
      return res.status(404).json({ message: 'Track not found' });
    }
    
    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting track', error: error.message });
  }
};

// Search YouTube for tracks
export const searchYoutubeVideos = async (req, res) => {
  try {
    const { query, maxResults } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const results = await searchVideos(query, maxResults || 10);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching YouTube', error: error.message });
  }
};

// Get track by YouTube ID
export const getTrackByYoutubeId = async (req, res) => {
  try {
    const { youtubeId } = req.params;
    
    const track = await Track.findOne({ youtubeId });
    
    if (!track) {
      // If track not in database, try to fetch from YouTube API
      try {
        const trackData = await getVideoDetails(youtubeId);
        return res.status(200).json(trackData);
      } catch (ytError) {
        return res.status(404).json({ message: 'Track not found on YouTube' });
      }
    }
    
    res.status(200).json(track);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching track', error: error.message });
  }
};

export default {
  getTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
  searchYoutubeVideos,
  getTrackByYoutubeId
}; 