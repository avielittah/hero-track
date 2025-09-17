import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export type BuddyMood = 'normal' | 'thinking' | 'happy' | 'pointing' | 'surprised';

interface BuddyCharacterProps {
  mood?: BuddyMood;
  size?: number;
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

export const BuddyCharacter = ({ 
  mood = 'normal', 
  size = 48, 
  animated = true,
  onClick,
  className = ''
}: BuddyCharacterProps) => {
  const [currentMood, setCurrentMood] = useState<BuddyMood>(mood);
  
  // Auto-cycle through moods for natural feel
  useEffect(() => {
    if (!animated) return;
    
    const moodCycle = () => {
      const moods: BuddyMood[] = ['normal', 'thinking', 'happy', 'normal'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setCurrentMood(randomMood);
    };
    
    const interval = setInterval(moodCycle, 4000 + Math.random() * 3000); // 4-7 seconds
    return () => clearInterval(interval);
  }, [animated]);

  // Eye positions and expressions
  const getEyePositions = () => {
    switch (currentMood) {
      case 'thinking':
        return { leftX: 16, leftY: 18, rightX: 32, rightY: 16 }; // Looking up-right
      case 'happy':
        return { leftX: 18, leftY: 20, rightX: 30, rightY: 20 }; // Centered, slightly squinted
      case 'pointing':
        return { leftX: 20, leftY: 18, rightX: 32, rightY: 18 }; // Looking right
      case 'surprised':
        return { leftX: 18, leftY: 16, rightX: 30, rightY: 16 }; // Wide open
      default:
        return { leftX: 18, leftY: 19, rightX: 30, rightY: 19 }; // Normal centered
    }
  };

  const getMouthPath = () => {
    switch (currentMood) {
      case 'happy':
        return 'M20,28 Q24,32 28,28'; // Smile
      case 'thinking':
        return 'M22,28 Q24,30 26,28'; // Small contemplative
      case 'surprised':
        return 'M24,28 Q24,32 24,28'; // Small O shape
      default:
        return 'M22,29 L26,29'; // Neutral line
    }
  };

  const getEyeSize = () => {
    return currentMood === 'surprised' ? 3 : currentMood === 'happy' ? 2 : 2.5;
  };

  const eyePositions = getEyePositions();

  return (
    <motion.div 
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={animated ? { 
        rotate: [0, -2, 2, 0],
        y: [0, -2, 0]
      } : {}}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        className="drop-shadow-lg"
      >
        {/* Head circle with gradient */}
        <defs>
          <radialGradient id="headGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main head */}
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          fill="url(#headGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          filter="url(#glow)"
          animate={{ 
            r: currentMood === 'surprised' ? [20, 21, 20] : 20
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Left eye */}
        <motion.circle
          cx={eyePositions.leftX}
          cy={eyePositions.leftY}
          r={getEyeSize()}
          fill="hsl(var(--foreground))"
          animate={{
            cx: eyePositions.leftX,
            cy: eyePositions.leftY,
            r: getEyeSize()
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Right eye */}
        <motion.circle
          cx={eyePositions.rightX}
          cy={eyePositions.rightY}
          r={getEyeSize()}
          fill="hsl(var(--foreground))"
          animate={{
            cx: eyePositions.rightX,
            cy: eyePositions.rightY,
            r: getEyeSize()
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Eyebrows (for thinking mood) */}
        {currentMood === 'thinking' && (
          <>
            <motion.path
              d="M14,14 Q18,12 22,14"
              stroke="hsl(var(--foreground))"
              strokeWidth="1.5"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <motion.path
              d="M26,14 Q30,12 34,14"
              stroke="hsl(var(--foreground))"
              strokeWidth="1.5"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          </>
        )}
        
        {/* Mouth */}
        <motion.path
          d={getMouthPath()}
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ d: getMouthPath() }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Blush for happy mood */}
        {currentMood === 'happy' && (
          <>
            <motion.circle
              cx="14"
              cy="26"
              r="3"
              fill="hsl(var(--primary) / 0.3)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
            />
            <motion.circle
              cx="34"
              cy="26"
              r="3"
              fill="hsl(var(--primary) / 0.3)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
            />
          </>
        )}

        {/* Thought bubble for thinking */}
        {currentMood === 'thinking' && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <circle cx="38" cy="10" r="2" fill="hsl(var(--primary) / 0.4)" />
            <circle cx="42" cy="6" r="1" fill="hsl(var(--primary) / 0.4)" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};