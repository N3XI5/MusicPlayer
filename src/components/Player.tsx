import { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

interface PlayerProps {
  videoId: string;
  isPlaying: boolean;
  onEnd: () => void;
}

const Player: React.FC<PlayerProps> = ({ videoId, isPlaying, onEnd }) => {
  const playerRef = useRef<any>(null);
  const videoIdRef = useRef<string>(videoId);

  // Options for the YouTube player
  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
    },
  };

  // Play/pause when isPlaying changes
  useEffect(() => {
    if (!playerRef.current) return;

    // Only control playback if the player is ready and the video ID hasn't changed
    if (videoIdRef.current === videoId) {
      if (isPlaying) {
        try {
          playerRef.current.playVideo();
        } catch (error) {
          console.error('Failed to play video:', error);
        }
      } else {
        try {
          playerRef.current.pauseVideo();
        } catch (error) {
          console.error('Failed to pause video:', error);
        }
      }
    }
  }, [isPlaying, videoId]);

  // When videoId changes, update the ref
  useEffect(() => {
    videoIdRef.current = videoId;
  }, [videoId]);

  // Handle player ready event
  const onReady = (event: any) => {
    playerRef.current = event.target;
    
    // Store the current videoId
    videoIdRef.current = videoId;
    
    // If isPlaying is true, start playing
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  // Handle state changes
  const onStateChange = (event: any) => {
    // When the video ends (state 0), call the onEnd callback
    if (event.data === 0) {
      onEnd();
    }

    // When the video is ready to play (state 1), and isPlaying is true
    // This helps with auto-play after loading a new video
    if (event.data === 1 && !isPlaying) {
      event.target.pauseVideo();
    }

    // When the video is cued (state 5) and isPlaying is true, play it
    if (event.data === 5 && isPlaying) {
      event.target.playVideo();
    }
  };

  return (
    <div className="hidden">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        onEnd={onEnd}
      />
    </div>
  );
};

export default Player;
