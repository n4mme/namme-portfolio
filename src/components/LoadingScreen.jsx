import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code2, Cpu, Database } from 'lucide-react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const icons = [
    { Icon: Terminal, label: 'Terminal', angle: 0 },
    { Icon: Code2, label: 'Code', angle: 90 },
    { Icon: Cpu, label: 'Cpu', angle: 180 },
    { Icon: Database, label: 'Database', angle: 270 },
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121212] text-zinc-100 select-none overflow-hidden"
    >
      {/* Subtle background ambient radial glow */}
      <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -bottom-10 right-10" />

      {/* Cybernetic Icon Orbit Container */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-8">
        {/* Outer subtle orbital ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-zinc-700/60"
        />

        {/* Counter-rotating accent ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-t border-r border-emerald-500/40"
        />

        {/* Center glowing badge / processor core */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], boxShadow: ['0 0 15px rgba(16,185,129,0.2)', '0 0 30px rgba(16,185,129,0.4)', '0 0 15px rgba(16,185,129,0.2)'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center z-10 shadow-2xl"
        >
          <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            N
          </span>
        </motion.div>

        {/* 4 Rotating / Pulsing IT & Development Icons */}
        {icons.map(({ Icon, angle }, idx) => {
          const rad = (angle * Math.PI) / 180;
          const radius = 64; // distance from center
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <motion.div
              key={idx}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.75, 1, 0.75],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: idx * 0.35,
                ease: 'easeInOut',
              }}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              className="absolute w-9 h-9 rounded-lg bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-emerald-400 shadow-md backdrop-blur-sm"
            >
              <Icon size={18} strokeWidth={2.2} />
            </motion.div>
          );
        })}
      </div>

      {/* Title & Glow */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center px-4"
      >
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Welcome to my <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Portfolio</span>
        </h2>
        <p className="text-xs sm:text-sm font-mono text-zinc-400 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Emmanuel Nantes (NAMME) &bull; BSIT
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-56 sm:w-72 mt-7">
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mt-2">
          <span>INITIALIZING</span>
          <span>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
