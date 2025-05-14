'use client';

import { useState, useEffect } from 'react';
import AlbumArt from '../../components/AlbumArt';
import Controls from '../../components/Controls';
import Player from '../../components/Player';
import {
  getActivePlaylist,
  getCurrentTrack,
  getNextTrack,
  getPlaylists,
  setActivePlaylist
} from '../../services/playlistService';

export default function PlayerPage() {
  const [activePlaylist, setActivePlaylistState] = useState<any>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load active playlist on component mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        
        // Fetch all playlists
        const playlistsData = await getPlaylists();
        setPlaylists(playlistsData);
        
        // Try to get active playlist
        const playlist = await getActivePlaylist();
        if (playlist) {
          setActivePlaylistState(playlist);
          
          // Get current track
          const track = await getCurrentTrack();
          if (track) {
            setCurrentTrack(track);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setLoading(false);
      }
    }
    
    loadInitialData();
  }, []);

  // Handle play/pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle track end
  const handleTrackEnd = async () => {
    if (currentTrack) {
      try {
        const nextTrack = await getNextTrack(currentTrack._id);
        if (nextTrack) {
          setCurrentTrack(nextTrack);
        }
      } catch (error) {
        console.error('Error getting next track:', error);
      }
    }
  };

  // Handle skip
  const handleSkip = async () => {
    if (currentTrack) {
      try {
        const nextTrack = await getNextTrack(currentTrack._id);
        if (nextTrack) {
          setCurrentTrack(nextTrack);
          // Keep playing if it was already playing
          if (isPlaying) {
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error('Error skipping track:', error);
      }
    }
  };

  // Handle color extraction from album art
  const handleColorExtracted = (extractedColors: string[]) => {
    setColors(extractedColors);
  };

  // Handle playlist selection
  const handleSelectPlaylist = async (playlistId: string) => {
    try {
      const activatedPlaylist = await setActivePlaylist(playlistId);
      setActivePlaylistState(activatedPlaylist);
      
      const track = await getCurrentTrack();
      if (track) {
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error selecting playlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col p-6 text-white transition-colors duration-1000"
      style={{
        background: colors.length > 0 
          ? `linear-gradient(135deg, ${colors[0]} 0%, #000 100%)` 
          : '#000'
      }}
    >
      {currentTrack ? (
        <>
          <div className="mb-8">
            <AlbumArt 
              image={currentTrack.image} 
              title={currentTrack.title} 
              artist={currentTrack.artist}
              onColorExtracted={handleColorExtracted}
            />
          </div>
          
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-1">{currentTrack.title}</h1>
            <p className="text-lg text-white/70">{currentTrack.artist}</p>
            {activePlaylist && (
              <p className="text-sm text-white/50 mt-2">
                Playing from: {activePlaylist.name}
              </p>
            )}
          </div>
          
          <Controls 
            isPlaying={isPlaying} 
            onPlayPause={handlePlayPause} 
            onSkip={handleSkip} 
          />
          
          <Player
            videoId={currentTrack.youtubeId}
            isPlaying={isPlaying}
            onEnd={handleTrackEnd}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow">
          <h1 className="text-2xl font-bold mb-6">Select a Playlist</h1>
          
          {playlists.length > 0 ? (
            <div className="w-full max-w-md space-y-4">
              {playlists.map((playlist) => (
                <button 
                  key={playlist._id}
                  className="w-full p-4 border border-white/20 hover:border-white/40 transition-colors flex flex-col items-start"
                  onClick={() => handleSelectPlaylist(playlist._id)}
                >
                  <span className="text-lg font-medium">{playlist.name}</span>
                  {playlist.description && (
                    <span className="text-sm text-white/70 mt-1">{playlist.description}</span>
                  )}
                  <span className="text-xs text-white/50 mt-2">
                    {playlist.tracks.length} tracks
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-white/70">
              No playlists found. Create a playlist to start streaming.
            </p>
          )}
        </div>
      )}
    </div>
  );
} 