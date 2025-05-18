import React from 'react';
import { MotionConfig } from 'framer-motion';

// Default motion settings with animations disabled
const motionConfig = {
  // Minimal animation duration
  transition: {
    duration: 0.1,
    ease: [0, 0, 1, 1], // Linear easing
  },
  // Disable animations
  reducedMotion: 'always',
  // Optimize rendering by rounding pixel values
  transformPagePoint: point => ({ x: Math.round(point.x), y: Math.round(point.y) })
};

// Component to wrap the app with motion configuration
export const MotionConfigProvider = ({ children }) => {
  return (
    <MotionConfig {...motionConfig}>
      {children}
    </MotionConfig>
  );
};

// Pure function that returns animation variants with animations disabled
export const getOptimizedVariants = () => {
  return {
    full: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      whileInView: { opacity: 1 },
      transition: { duration: 0 }
    },
    reduced: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      whileInView: { opacity: 1 },
      transition: { duration: 0 }
    }
  };
};