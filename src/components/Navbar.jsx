import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = ({ isDark, toggleTheme }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 72; // Header height allowance
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: 'smooth'
      });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md border-b ${
        isScrolled
          ? 'bg-white/80 dark:bg-zinc-900/85 border-zinc-200/80 dark:border-zinc-800 shadow-sm'
          : 'bg-white/60 dark:bg-zinc-900/70 border-zinc-200/50 dark:border-zinc-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Brand Name */}
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, '#home')}
          className="flex items-center group cursor-pointer"
        >
          <span className="font-extrabold text-2xl tracking-wider text-zinc-900 dark:text-white font-mono group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            NAMME
          </span>
        </a>

        {/* Center: Desktop Navigation Links in EXACT specified order */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/60 p-1.5 rounded-full border border-zinc-200/70 dark:border-zinc-700/60">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-emerald-600 dark:bg-emerald-500 rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Distinct "Hire Me" CTA + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Hire Me CTA Button */}
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, '#contact')}
            className="relative inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Hire Me</span>
          </a>

          {/* Theme Toggle Switch (Immediately to the right of Hire Me) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Night/Light theme"
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors focus:outline-none"
          >
            {isDark ? (
              <Sun size={18} className="text-amber-400 animate-[spin_10s_linear_infinite]" />
            ) : (
              <Moon size={18} className="text-zinc-700" />
            )}
          </button>
        </div>

        {/* Mobile Controls (< md) */}
        <div className="flex md:hidden items-center gap-2">
          {/* Theme Toggle on mobile */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Night/Light theme"
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                  </a>
                );
              })}
            </div>

            {/* Mobile "Hire Me" button */}
            <div className="pt-2">
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className="w-full py-3 px-4 rounded-xl text-center text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <Sparkles size={16} />
                <span>Hire Me</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
