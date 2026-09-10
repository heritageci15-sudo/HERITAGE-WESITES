import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollFadeSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
}

export const ScrollFadeSection: React.FC<ScrollFadeSectionProps> = ({
  children,
  className = '',
  id,
  delay = 0,
  yOffset = 28,
  duration = 0.75
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  );
};
