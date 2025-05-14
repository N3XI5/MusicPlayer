import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { google } from 'googleapis';

// Import routes
import playlistRoutes from './routes/playlists.js';
import trackRoutes from './routes/tracks.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/playlists', playlistRoutes);
app.use('/api/tracks', trackRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('YouTube Playlist API is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/youtube-playlist')
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default app; 