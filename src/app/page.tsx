'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlbumArt from '../components/AlbumArt';
import Player from '../components/Player';
import Controls from '../components/Controls';

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dominantColors, setDominantColors] = useState<string[]>(['#121212', '#1e1e1e', '#2d3436', '#0a0a0a', '#333333']);
  const [playlist, setPlaylist] = useState([
    {
      id: 'dQw4w9WgXcQ',
      title: 'Never Gonna Give You Up',
      artist: 'Rick Astley',
      image: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    },
    {
      id: '9bZkp7q19f0',
      title: 'Gangnam Style',
      artist: 'PSY',
      image: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    },
    {
      id: 'Zi_XLOBDo_Y',
      title: 'Never Gonna Give You Up (8D Audio)',
      artist: 'Rick Astley',
      image: 'https://i.ytimg.com/vi/Zi_XLOBDo_Y/maxresdefault.jpg',
    }
  ]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    
    // If not already playing, set to playing when skipping
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleTrackEnd = () => {
    handleSkip(); // Use the same skip handler to maintain playing state
  };

  const handleColorExtracted = (colors: string[]) => {
    const validColors = colors.filter(color => {
      return color !== '#000000' && color !== '#ffffff' && !color.match(/^#0[0-9a-f]{5}$/);
    });
    
    if (validColors.length >= 2) {
      setDominantColors(validColors);
    }
  };

  // Primary accent color
  const accentColor = dominantColors[0] || '#ffffff';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main container */}
        <div className="w-full border border-white/10 p-6 flex flex-col gap-6">
          {/* Track info - minimalist */}
          <div className="flex justify-between items-center">
            <p className="text-xs uppercase tracking-wider text-white/50">{`${currentTrack + 1}/${playlist.length}`}</p>
            <div 
              className="h-px flex-grow mx-4"
              style={{ backgroundColor: accentColor }}
            ></div>
            <p className="text-xs uppercase tracking-wider text-white/50">{isPlaying ? 'playing' : 'paused'}</p>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <AlbumArt 
                image={playlist[currentTrack].image} 
                title={playlist[currentTrack].title}
                artist={playlist[currentTrack].artist}
                onColorExtracted={handleColorExtracted}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Track title and artist - ultra minimal */}
          <div>
            <h1 className="text-base font-medium mb-1 uppercase">{playlist[currentTrack].title}</h1>
            <p className="text-xs text-white/50">{playlist[currentTrack].artist}</p>
          </div>
          
          <Controls 
            isPlaying={isPlaying} 
            onPlayPause={handlePlayPause}
            onSkip={handleSkip} 
          />
          
          <Player 
            videoId={playlist[currentTrack].id} 
            isPlaying={isPlaying}
            onEnd={handleTrackEnd}
          />
        </div>

        {/* Color accent line at bottom */}
        <div className="w-full h-1 mt-1" style={{ backgroundColor: accentColor }}></div>
      </div>
    </div>
  );
}
