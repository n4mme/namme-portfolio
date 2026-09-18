import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { educationData } from '../data/portfolioData';

const Education = () => {
  return (
    <section id="education" className="py-20 relative border-t border-zinc-200 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <GraduationCap size={14} />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-mono">
            Education &amp; Credentials
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Solid foundations in software engineering and systems design from Bulacan State University.
          </p>
        </div>

        {/* Education Timeline Cards */}
        <div className="max-w-4xl mx-auto">
          {educationData.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative pl-6 sm:pl-8 border-l-2 border-emerald-500/40 pb-6"
            >
              {/* Timeline Bullet */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-zinc-900 shadow" />

              {/* Main Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-emerald-500/50 transition-colors">
                
                {/* Meta details header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold">
                    <Calendar size={13} />
                    <span>{edu.period}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin size={13} />
                    <span>City of Malolos, Bulacan</span>
                  </span>
                </div>

                {/* Degree & Institution */}
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                  {edu.degree}
                </h3>
                <h4 className="text-base font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {edu.institution} &bull; <span className="text-zinc-600 dark:text-zinc-400 font-normal">{edu.specialization}</span>
                </h4>

                {/* Description */}
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {edu.description}
                </p>

                {/* Key Highlights */}
                <div className="mt-6 space-y-2.5">
                  <h5 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Award size={14} className="text-amber-500" />
                    <span>Key Milestones &amp; Activities</span>
                  </h5>
                  {edu.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Coursework Badges */}
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                    Relevant Coursework
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Web Systems & Technologies",
                      "Mobile Application Development",
                      "Object-Oriented Programming",
                      "Data Structures & Algorithms",
                      "Database Management Systems",
                      "Information Assurance & Security",
                      "Human-Computer Interaction",
                      "Software Engineering"
                    ].map((course) => (
                      <span
                        key={course}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Education;
