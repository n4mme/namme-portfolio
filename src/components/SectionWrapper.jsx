import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Cubic bezier ease specified: [0.25, 0.1, 0.25, 1.0]
export const smoothEase = [0.25, 0.1, 0.25, 1.0];

// Staggered container variants for internal components (cards, pills, timeline items)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Child item reveal variant
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
};

/**
 * SectionWrapper Component
 * - Wraps sections in scroll-triggered entrance animations (15–20% viewport threshold)
 * - Supports prefers-reduced-motion for accessibility
 * - Includes scroll-mt-20 to ensure content is never cut off beneath the sticky top nav
 */
const SectionWrapper = ({
  children,
  id,
  className = '',
  stagger = false,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, disable y-axis translation and only fade in gently
  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.7,
        ease: smoothEase,
        when: stagger ? 'beforeChildren' : undefined,
        staggerChildren: stagger ? 0.1 : undefined,
      },
    },
  };

  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
      className={`scroll-mt-20 relative py-20 border-t border-zinc-200 dark:border-zinc-800/80 ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
