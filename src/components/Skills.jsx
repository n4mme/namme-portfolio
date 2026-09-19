import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Layout, Server, GitBranch, Cpu, Sparkles } from 'lucide-react';
import SectionWrapper, { staggerContainer, fadeInUp } from './SectionWrapper';
import { skillCategories } from '../data/portfolioData';

const categoryIcons = {
  "AI-Assisted Software Development": Bot,
  "Frontend Engineering": Layout,
  "Backend & Databases": Server,
  "Tools & Deployment": GitBranch,
};

const Skills = () => {
  return (
    <SectionWrapper id="skills">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Cpu size={14} />
            <span>Technical Proficiencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-sans">
            Stack &amp; Capabilities
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            A battle-tested technical arsenal refined through modern architectures and AI-accelerated velocity.
          </p>
        </motion.div>

        {/* Skill Category Cards in a Polished 2x2 Grid with Staggered Cascade */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {skillCategories.map((cat, idx) => {
            const Icon = categoryIcons[cat.title] || Cpu;
            const isPriority = idx === 0;

            return (
              <motion.div
                key={cat.title}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className={`relative rounded-2xl bg-white dark:bg-zinc-900 border p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                  isPriority
                    ? 'border-emerald-500/30 dark:border-emerald-500/30 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40'
                }`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all duration-300">
                        <Icon size={22} />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {cat.title}
                      </h3>
                    </div>

                    {isPriority && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        <Sparkles size={11} className="text-emerald-500" />
                        <span>Top Focus</span>
                      </span>
                    )}
                  </div>

                  {/* Concise Engineering Impact Overview */}
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                {/* Interactive Tech Badges / Chips */}
                <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800/80 mt-auto">
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold mb-3">
                    Technologies &amp; Tooling
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.22)] transition-all duration-200 cursor-default select-none"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </SectionWrapper>
  );
};

export default Skills;
