import express from 'express';
import {
  getTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
  searchYoutubeVideos,
  getTrackByYoutubeId
} from '../controllers/trackController.js';

const router = express.Router();

// GET all tracks
router.get('/', getTracks);

// GET track by ID
router.get('/:id', getTrackById);

// POST create new track from YouTube ID
router.post('/', createTrack);

// PUT update track
router.put('/:id', updateTrack);

// DELETE track
router.delete('/:id', deleteTrack);

// GET search YouTube for tracks
router.get('/search/youtube', searchYoutubeVideos);

// GET track by YouTube ID
router.get('/youtube/:youtubeId', getTrackByYoutubeId);

export default router; 