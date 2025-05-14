import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AlbumArtProps {
  image: string;
  title: string;
  artist: string;
  onColorExtracted?: (colors: string[]) => void;
}

const AlbumArt: React.FC<AlbumArtProps> = ({ image, title, artist, onColorExtracted }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Extract dominant colors from the album art
  useEffect(() => {
    if (!onColorExtracted) return;

    // Create a canvas to analyze the image
    const extractColors = () => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = image;
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          // Draw the image centered in the canvas
          ctx.drawImage(
            img, 
            (img.width - size) / 2, 
            (img.height - size) / 2, 
            size, 
            size, 
            0, 
            0, 
            size, 
            size
          );
          
          // Sample more points for better color extraction
          const sampleSize = 20;
          const colors: string[] = [];
          
          // Sample grid of points
          for (let x = 0; x < sampleSize; x++) {
            for (let y = 0; y < sampleSize; y++) {
              const pixelX = Math.floor((x / sampleSize) * size);
              const pixelY = Math.floor((y / sampleSize) * size);
              
              const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
              const [r, g, b] = pixel;
              
              // Skip black and very dark colors
              const brightness = (r + g + b) / 3;
              if (brightness < 20) continue;
              
              const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
              colors.push(hex);
            }
          }
          
          // Filter out duplicates
          const uniqueColors = [...new Set(colors)];
          
          // Sort by hue and take a sample
          const sortedColors = uniqueColors
            .map(color => {
              const r = parseInt(color.slice(1, 3), 16);
              const g = parseInt(color.slice(3, 5), 16);
              const b = parseInt(color.slice(5, 7), 16);
              
              // Convert RGB to HSL
              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              const l = (max + min) / 2;
              
              let h = 0;
              let s = 0;
              
              if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
                else if (max === g) h = (b - r) / d + 2;
                else h = (r - g) / d + 4;
                
                h /= 6;
              }
              
              return { color, h, s, l };
            })
            .sort((a, b) => a.h - b.h)
            .map(item => item.color);
          
          // Take a sample of colors spread across the hue spectrum
          const step = Math.max(1, Math.floor(sortedColors.length / 5));
          const sampledColors = [0, 1, 2, 3, 4].map(i => 
            sortedColors[Math.min(i * step, sortedColors.length - 1)]
          ).filter(Boolean);
          
          if (sampledColors.length > 0) {
            onColorExtracted(sampledColors);
          }
        } catch (err) {
          console.error('Error extracting colors:', err);
        }
      };
      
      img.onerror = (e) => {
        console.error('Error loading image for color extraction:', e);
      };
    };
    
    extractColors();
  }, [image, onColorExtracted]);

  return (
    <div className="perspective-800 w-full aspect-square">
      <motion.div 
        ref={containerRef}
        className="w-full h-full overflow-hidden border-b border-white/10 preserve-3d"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        animate={{
          rotateX: mousePosition.y * 10,
          rotateY: mousePosition.x * -10,
        }}
      >
        <motion.div
          className="w-full h-full preserve-3d"
          animate={{
            x: mousePosition.x * 15,
            y: mousePosition.y * 15,
            scale: 1.05
          }}
          transition={{ type: "spring", stiffness: 120, damping: 25 }}
        >
          <div 
            className="w-full h-full bg-center bg-cover" 
            style={{ backgroundImage: `url(${image})` }} 
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AlbumArt;
