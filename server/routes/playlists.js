import express from 'express';
import {
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
} from '../controllers/playlistController.js';

const router = express.Router();

// GET active playlist
router.get('/active', getActivePlaylist);

// GET current track from active playlist
router.get('/active/track', getCurrentTrack);

// GET next track from active playlist
router.get('/active/track/:currentTrackId/next', getNextTrack);

// PUT set playlist as active
router.put('/:id/activate', setActivePlaylist);

// GET all playlists
router.get('/', getPlaylists);

// GET playlist by ID
router.get('/:id', getPlaylistById);

// POST create new playlist
router.post('/', createPlaylist);

// PUT update playlist
router.put('/:id', updatePlaylist);

// DELETE playlist
router.delete('/:id', deletePlaylist);

// POST add track to playlist
router.post('/:id/tracks', addTrackToPlaylist);

// DELETE remove track from playlist
router.delete('/:id/tracks/:trackId', removeTrackFromPlaylist);

export default router; 