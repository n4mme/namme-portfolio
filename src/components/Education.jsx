import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, CheckCircle2, Sparkles } from 'lucide-react';
import SectionWrapper, { staggerContainer, fadeInUp } from './SectionWrapper';
import { educationData } from '../data/portfolioData';

const Education = () => {
  return (
    <SectionWrapper id="education">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Clean Sans-Serif Typography */}
        <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <GraduationCap size={14} />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-sans">
            Education &amp; Credentials
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Continuous technical growth from senior high school foundations to university software engineering.
          </p>
        </motion.div>

        {/* Continuous Connected Vertical Timeline */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Continuous Vertical Accent Line connecting top card to bottom card */}
          <div className="absolute left-4 sm:left-5 top-4 bottom-8 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-500/80 to-emerald-500/30 -translate-x-1/2 rounded-full pointer-events-none" />

          {/* Staggered Timeline Items */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-12"
          >
            {educationData.map((edu, idx) => {
              const isCollege = idx === 0;
              const isCompleted = edu.status === "Completed";

              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="relative flex items-start group"
                >
                  {/* Timeline Dot Marker (Neatly tucked along the left edge) */}
                  <div className="absolute left-4 sm:left-5 -translate-x-1/2 top-7 z-10">
                    <div className="relative flex items-center justify-center">
                      {isCollege ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-emerald-400 opacity-60"></span>
                          <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-zinc-900 shadow-md shadow-emerald-500/30" />
                        </>
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-3 border-white dark:border-zinc-900 shadow-sm" />
                      )}
                    </div>
                  </div>

                  {/* Main Milestone Card */}
                  <div className="ml-10 sm:ml-12 w-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-lg dark:hover:shadow-emerald-950/20 transition-all duration-300">
                    
                    {/* Header: Period, Location & Status Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Period Badge */}
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-semibold border border-emerald-500/20">
                          <Calendar size={13} />
                          <span>{edu.period}</span>
                        </span>

                        {/* Status Badge */}
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                            <CheckCircle2 size={12} />
                            <span>Completed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>In Progress</span>
                          </span>
                        )}

                        {/* Distinction Badge (for SHS Honors) */}
                        {edu.distinction && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 shadow-xs">
                            <Sparkles size={12} className="text-amber-500" />
                            <span>{edu.distinction}</span>
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        <MapPin size={13} className="text-zinc-400" />
                        <span>{edu.location}</span>
                      </span>
                    </div>

                    {/* Degree & Institution */}
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mt-2">
                      {edu.degree}
                    </h3>
                    <h4 className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex flex-wrap items-center gap-1.5">
                      <span>{edu.institution}</span>
                      <span className="text-zinc-400 dark:text-zinc-600">&bull;</span>
                      <span className="text-zinc-600 dark:text-zinc-400 font-normal">{edu.specialization}</span>
                    </h4>

                    {/* Narrative Description */}
                    <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {edu.description}
                    </p>

                    {/* Highlights & Key Milestones */}
                    <div className="mt-6 space-y-2.5">
                      <h5 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <Award size={14} className="text-emerald-500" />
                        <span>Key Focus &amp; Milestones</span>
                      </h5>
                      {edu.highlights.map((highlight, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* Focus / Coursework Badges */}
                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2.5">
                        {isCollege ? "Relevant Coursework" : "Core Technical Modules"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {edu.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>

      </div>
    </SectionWrapper>
  );
};

export default Education;
