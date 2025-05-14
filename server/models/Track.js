import mongoose from 'mongoose';

const TrackSchema = new mongoose.Schema({
  youtubeId: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    trim: true,
    default: 'Unknown'
  },
  image: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  // Track metadata from YouTube
  metadata: {
    views: Number,
    likes: Number,
    publishedAt: Date,
    channelId: String,
    channelTitle: String,
    description: String
  }
});

const Track = mongoose.model('Track', TrackSchema);

export default Track; 