import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CVModal from './components/CVModal';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [isCVOpen, setIsCVOpen] = useState(false);

  // Initialize and persist dark/light theme (default: deep dark grey night mode)
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      const isDarkMode = savedTheme === 'dark';
      setIsDark(isDarkMode);
      document.documentElement.classList.toggle('dark', isDarkMode);
    } else {
      // Default to dark mode
      setIsDark(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const nextMode = !prev;
      document.documentElement.classList.toggle('dark', nextMode);
      localStorage.setItem('portfolio-theme', nextMode ? 'dark' : 'light');
      return nextMode;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#121212] dark:text-zinc-100 transition-colors duration-300 relative selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      {/* Persistent Ambient "Flashy" Floating Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.35, 0.15],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: 'easeInOut',
          }}
          className="absolute -top-24 -left-24 w-96 sm:w-[550px] h-96 sm:h-[550px] rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.12, 0.3, 0.12],
            x: [0, -50, 0],
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute top-1/3 -right-32 w-96 sm:w-[600px] h-96 sm:h-[600px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-emerald-500/10 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [0, 30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute -bottom-32 left-1/4 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-gradient-to-tr from-emerald-600/15 via-teal-400/15 to-transparent blur-3xl"
        />
      </div>
      {/* IT-Themed Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Portfolio Content */}
      <div className="flex flex-col min-h-screen">
        {/* Sticky Top Navigation Bar */}
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />

        {/* Content Sections */}
        <main className="flex-grow">
          {/* Section 3: Hero (#home) with swinging ID badge & anagram/typewriter */}
          <Hero onOpenCV={() => setIsCVOpen(true)} />

          {/* Section: About (#about) */}
          <About />

          {/* Section: Projects (#projects) */}
          <Projects />

          {/* Section: Skills (#skills) */}
          <Skills />

          {/* Section: Education (#education) */}
          <Education />

          {/* Section: Contact (#contact) */}
          <Contact />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* CV Modal */}
      <CVModal isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
    </div>
  );
}

export default App;
