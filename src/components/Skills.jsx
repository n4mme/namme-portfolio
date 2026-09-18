import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Layout, Server, Smartphone, Bot, Check } from 'lucide-react';
import SectionWrapper, { staggerContainer, fadeInUp } from './SectionWrapper';
import { skillCategories } from '../data/portfolioData';

const categoryIcons = {
  "Frontend Engineering": Layout,
  "Backend & Databases": Server,
  "Mobile Development": Smartphone,
  "AI & Developer Tooling": Bot
};

const Skills = () => {
  return (
    <SectionWrapper id="skills">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Wrench size={14} />
            <span>Technical Proficiencies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-sans">
            Stack &amp; Capabilities
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            A battle-tested technical arsenal refined through university coursework and production builds.
          </p>
        </motion.div>

        {/* Skill Category Cards with Staggered Cascade */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {skillCategories.map((cat) => {
            const Icon = categoryIcons[cat.title] || Wrench;

            return (
              <motion.div
                key={cat.title}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Category Header */}
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                    {cat.title}
                  </h3>

                  {/* Skills List */}
                  <div className="space-y-3">
                    {cat.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-xs"
                      >
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {skill.name}
                        </span>
                        <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Indicator */}
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                  <Check size={14} className="text-emerald-500" />
                  <span>Production Ready</span>
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
