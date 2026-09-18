import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#121212] dark:text-zinc-100 transition-colors duration-300 relative selection:bg-emerald-500 selection:text-white">
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
