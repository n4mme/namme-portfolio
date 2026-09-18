import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download, Sparkles, RefreshCw } from 'lucide-react';
import LanyardBadge from './LanyardBadge';
import { personalInfo, typewriterPhrases } from '../data/portfolioData';

// Character sets for exact anagram rearrangement
const NAMME_LETTERS = [
  { id: 'i', char: 'I' },
  { id: 'apos', char: "'" },
  { id: 'm1', char: 'M' },
  { id: 'sp', char: ' ' },
  { id: 'n', char: 'N' },
  { id: 'a', char: 'A' },
  { id: 'm2', char: 'M' },
  { id: 'm3', char: 'M' },
  { id: 'e', char: 'E' },
];

const EMMAN_LETTERS = [
  { id: 'i', char: 'I' },
  { id: 'apos', char: "'" },
  { id: 'm1', char: 'M' },
  { id: 'sp', char: ' ' },
  { id: 'e', char: 'E' },
  { id: 'm2', char: 'M' },
  { id: 'm3', char: 'M' },
  { id: 'a', char: 'A' },
  { id: 'n', char: 'N' },
];

const Hero = ({ onOpenCV }) => {
  // Anagram state: true for NAMME, false for EMMAN
  const [isNamme, setIsNamme] = useState(true);

  // Typewriter state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Anagram automatic rearrangement loop
  useEffect(() => {
    const anagramInterval = setInterval(() => {
      setIsNamme((prev) => !prev);
    }, 4000);
    return () => clearInterval(anagramInterval);
  }, []);

  // Typewriter effect logic
  useEffect(() => {
    const currentTarget = typewriterPhrases[phraseIndex];
    let typingTimer;

    if (!isDeleting) {
      if (currentText.length < currentTarget.length) {
        typingTimer = setTimeout(() => {
          setCurrentText(currentTarget.slice(0, currentText.length + 1));
        }, 75);
      } else {
        // Pause at end of word
        typingTimer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (currentText.length > 0) {
        typingTimer = setTimeout(() => {
          setCurrentText(currentTarget.slice(0, currentText.length - 1));
        }, 40);
      } else {
        // Move to next word
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
      }
    }

    return () => clearTimeout(typingTimer);
  }, [currentText, isDeleting, phraseIndex]);

  const activeLetters = isNamme ? NAMME_LETTERS : EMMAN_LETTERS;

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-72px)] flex items-center justify-center pt-8 pb-16 overflow-x-clip"
    >
      {/* Subtle background ambient mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 3D Interactive Hanging ID Card & Lanyard (Full-Hero Viewport Canvas) */}
      <LanyardBadge />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Two-Column Responsive Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[560px]">
          
          {/* Left Column Spacer: Reserves exact physical layout space for the badge */}
          <div className="lg:col-span-5 h-[440px] lg:h-full pointer-events-none order-2 lg:order-1" />

          {/* Right Column: Typography & Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2">
            
            {/* Top Subtitle / Student Identity Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-semibold mb-4"
            >
              <Sparkles size={14} className="text-emerald-500" />
              <span>{personalInfo.name}</span>
              <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-sans">BSIT Developer</span>
            </motion.div>

            {/* Anagram Rearranging Heading ("I'M NAMME" <-> "I'M EMMAN") */}
            <div className="relative mb-3 flex items-center gap-3">
              <h1
                className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-mono flex items-center justify-center lg:justify-start cursor-pointer group"
                onClick={() => setIsNamme((prev) => !prev)}
                title="Click to manually rearrange anagram letters"
              >
                {activeLetters.map((item) => (
                  <motion.span
                    key={item.id}
                    layout
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 24,
                    }}
                    className={`inline-block ${
                      item.char === ' '
                        ? 'w-3 sm:w-5'
                        : item.id === 'n' || item.id === 'a' || item.id === 'e' || item.id === 'm2' || item.id === 'm3'
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500'
                        : ''
                    }`}
                  >
                    {item.char}
                  </motion.span>
                ))}
              </h1>

              {/* Anagram toggle helper button */}
              <button
                onClick={() => setIsNamme((prev) => !prev)}
                aria-label="Rearrange Name Anagram"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Rearrange letters"
              >
                <RefreshCw size={16} className="animate-[spin_8s_linear_infinite]" />
              </button>
            </div>

            {/* Typewriter Subtitle */}
            <div className="h-10 sm:h-12 flex items-center text-xl sm:text-2xl md:text-3xl font-bold text-zinc-700 dark:text-zinc-300 mb-5 font-mono">
              {/* Fixed Prefix: "I'm a " (must NOT be deleted) */}
              <span className="text-zinc-500 dark:text-zinc-400 mr-2 select-none">
                I'm a
              </span>
              {/* Rotating typed suffix */}
              <span className="text-emerald-600 dark:text-emerald-400">
                {currentText}
              </span>
              {/* Blinking typing cursor */}
              <span className="inline-block w-0.5 h-6 sm:h-8 ml-1 bg-emerald-500 animate-pulse"></span>
            </div>

            {/* Bio Paragraph */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl mb-8">
              BSIT student specializing in Web &amp; Mobile Development at Bulacan State University. I architect modern web and mobile applications by leveraging AI-assisted workflows to rapidly move from concept to scalable digital products.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              {/* Primary Button: View Projects */}
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowUpRight size={18} />
              </a>

              {/* Secondary Button: Download CV */}
              <button
                onClick={onOpenCV}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Download size={18} className="text-emerald-500" />
                <span>Download CV</span>
              </button>
            </div>

            {/* Status / Availability Badge with Pulsing Green Indicator Dot */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-100/90 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Open to Professional Internship and Early-Career Opportunities
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
