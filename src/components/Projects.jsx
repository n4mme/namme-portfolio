import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderGit2 } from 'lucide-react';
import SectionWrapper, { fadeInUp } from './SectionWrapper';
import CardSlider from './CardSlider';
import { projectList } from '../data/portfolioData';

const Projects = () => {
  const categories = ['All', ...Array.from(new Set(projectList.map((p) => p.category)))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projectList
    : projectList.filter((p) => p.category === activeCategory);

  return (
    <SectionWrapper id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              <FolderGit2 size={14} />
              <span>Featured Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-sans">
              Engineered Applications
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
              Explore game developments, UI/UX mobile designs, web platforms, and desktop software.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeCategory === category
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Responsive 3-Item Card Carousel with Left/Right frosted glass navigation */}
        <motion.div variants={fadeInUp}>
          <CardSlider items={filteredProjects} />
        </motion.div>

      </div>
    </SectionWrapper>
  );
};

export default Projects;
