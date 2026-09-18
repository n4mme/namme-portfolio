import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Snappy spring transition physics: stiffness 100, damping 15
export const snappySpring = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
  mass: 0.8,
};

// Smooth cubic bezier fallback
export const smoothEase = [0.25, 0.1, 0.25, 1.0];

// Staggered container variants for internal components (cards, pills, timeline items)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

// Child item reveal variant with snappy spring physics
export const fadeInUp = {
  hidden: { opacity: 0, y: 35, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
    },
  },
};

/**
 * SectionWrapper Component
 * - Re-triggering scroll animations (never one-time only): viewport={{ once: false, amount: 0.25 }}
 * - Energetic entrance/exit spring physics (stiffness: 100, damping: 15)
 * - Internal 0.12s staggered cascading for cards, tags, and timeline nodes
 * - Generous scroll-mt-24 to ensure content clears the floating glass header
 * - Integrated subtle ambient glow backdrop with infinite gentle breathing
 */
const SectionWrapper = ({
  children,
  id,
  className = '',
  stagger = false,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Bi-directional section entrance/exit variants
  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 50,
      scale: shouldReduceMotion ? 1 : 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: shouldReduceMotion ? 'tween' : 'spring',
        stiffness: 100,
        damping: 15,
        mass: 0.8,
        duration: shouldReduceMotion ? 0.3 : undefined,
        when: stagger ? 'beforeChildren' : undefined,
        staggerChildren: stagger ? 0.12 : undefined,
      },
    },
  };

  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      variants={sectionVariants}
      className={`scroll-mt-24 relative py-20 border-t border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden ${className}`}
      {...props}
    >
      {/* Subtle localized ambient floating glow backdrop */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.08, 0.2, 0.08],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: 'easeInOut',
          }}
          className="absolute -top-24 right-1/4 w-[450px] h-[300px] rounded-full bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl"
        />
      </div>

      {children}
    </motion.section>
  );
};

export default SectionWrapper;
