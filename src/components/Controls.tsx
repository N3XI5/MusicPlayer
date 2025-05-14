import { motion } from 'framer-motion';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkip: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, onPlayPause, onSkip }) => {
  return (
    <div className="flex items-center gap-4">
      {/* Play/Pause Button */}
      <motion.button
        className="flex items-center justify-center w-10 h-10 border border-white/20 hover:border-white/40 transition-colors"
        whileTap={{ scale: 0.95 }}
        onClick={onPlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        )}
      </motion.button>
      
      {/* Skip Button */}
      <motion.button
        className="flex items-center justify-center w-10 h-10 border border-white/20 hover:border-white/40 transition-colors"
        whileTap={{ scale: 0.95 }}
        onClick={onSkip}
        aria-label="Skip"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="square" strokeLinejoin="miter" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
        </svg>
      </motion.button>
      
      {/* Spacer */}
      <div className="flex-1"></div>
      
      {/* Track indicator */}
      <div className="text-xs text-white/50 uppercase tracking-wider">
        Track
      </div>
    </div>
  );
};

export default Controls;
