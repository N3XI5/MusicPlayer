# YouTube Playlist App

A modern web application that streams playlists from YouTube with a beautiful parallax effect on album art.

## Features

- Stream YouTube videos as audio tracks
- Beautiful album art display with parallax effect
- Simple playback controls (play/pause and skip)
- Modern and minimalist UI

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/youtube-playlist-app.git
cd youtube-playlist-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- Click the Play button to start playing the current track
- Click the Pause button to pause the current track
- Click the Skip button to skip to the next track in the playlist
- Move your mouse over the album art to see the parallax effect

## Customization

To add your own playlist, edit the `playlist` array in `src/pages/index.jsx`.

Each track should have the following format:
```javascript
{
  id: 'YouTubeVideoId',
  title: 'Track Title',
  artist: 'Artist Name',
  image: 'URL to Album Art Image'
}
```

## License

MIT
