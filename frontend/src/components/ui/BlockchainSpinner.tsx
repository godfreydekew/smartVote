import React from 'react';
import { motion } from 'framer-motion';

interface BlockchainSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BlockchainSpinner: React.FC<BlockchainSpinnerProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-blue-500/20 rounded-full`}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner ring */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-t-blue-500 border-r-blue-400 border-b-blue-600 border-l-blue-300 rounded-full absolute top-0 left-0`}
          animate={{
            rotate: -360
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Center dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Blockchain nodes */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
              style={{
                top: `${Math.cos((i * 2 * Math.PI) / 3) * 12}px`,
                left: `${Math.sin((i * 2 * Math.PI) / 3) * 12}px`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}; 