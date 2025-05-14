import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Reference to the tracks in this playlist
  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }]
});

// Update the updatedAt timestamp before saving
PlaylistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

export default Playlist; 