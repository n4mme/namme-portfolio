import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Smartphone, Cpu, Award, BookOpen, Layers, Zap, Rocket } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

const highlights = [
  {
    icon: Code2,
    title: "Web Architecture",
    description: "Engineering performant, accessible web applications with React, modern state machines, and responsive Tailwind layouts."
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Building cross-platform iOS and Android experiences using React Native and Expo with native-feel interactions."
  },
  {
    icon: Cpu,
    title: "AI-Assisted Engineering",
    description: "Accelerating the development lifecycle via AI-powered pair programming, automated test generation, and intelligent scaffolding."
  },
  {
    icon: Rocket,
    title: "Rapid Prototyping",
    description: "Turning product concepts into live, tested full-stack MVPs deployed to cloud platforms in record time."
  }
];

const About = () => {
  return (
    <section id="about" className="py-20 relative border-t border-zinc-200 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <BookOpen size={14} />
            <span>About Me</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-mono">
            Crafting Digital Solutions at the Intersection of Code &amp; AI
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Based in Bulacan, Philippines &bull; Student, Developer, and Technology Enthusiast
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                My Background &amp; Philosophy
              </h3>
              
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                As an Information Technology undergraduate at <strong className="text-zinc-900 dark:text-white">Bulacan State University</strong> specializing in Web and Mobile Application Development, I immerse myself in both foundational computer science concepts and industry-standard modern frameworks.
              </p>

              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mt-4">
                I believe software engineering today is undergoing a massive transformation. By mastering <strong className="text-emerald-600 dark:text-emerald-400">AI-assisted workflows</strong>, I synthesize ideas into clean, maintainable, and scalable digital architectures faster than traditional methods allow—without sacrificing code quality or user experience.
              </p>

              {/* Quick Info Tags */}
              <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase">Institution</span>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Bulacan State University</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase">Field of Study</span>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">BS Information Technology</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase">Focus</span>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Web &amp; Mobile Dev</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase">Status</span>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available for Hire
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid Column */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                    <Icon size={24} />
                  </div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
