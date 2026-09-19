import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, ExternalLink, GraduationCap, Briefcase, Code, Award, CheckCircle2 } from 'lucide-react';
import { personalInfo, skillCategories, educationData, projectList } from '../data/portfolioData';

const CVModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate a downloadable text/markdown resume or open print dialog
    const cvContent = `
EMMANUEL NANTES (NAMME)
Full Stack & Mobile Developer
Email: ${personalInfo.email} | Location: ${personalInfo.location}
GitHub: ${personalInfo.github} | LinkedIn: ${personalInfo.linkedin}

EDUCATION
${educationData.map(e => `${e.degree}\n${e.institution} (${e.period})${e.distinction ? ` - ${e.distinction}` : ''}\n${e.specialization}`).join('\n\n')}

TECHNICAL SKILLS
${skillCategories.map(c => `${c.title}: ${c.skills.map(s => typeof s === 'string' ? s : s.name).join(', ')}`).join('\n')}

FEATURED PROJECTS
${projectList.map(p => `- ${p.title} (${p.category}): ${p.description}`).join('\n')}
    `.trim();

    const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Emmanuel_Nantes_CV.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base font-mono">
                Curriculum Vitae &bull; Emmanuel Nantes
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                aria-label="Print CV"
                className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                title="Print CV"
              >
                <Printer size={16} />
              </button>
              <button
                onClick={handleDownload}
                aria-label="Download CV"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ml-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* CV Content Scroll Area */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-zinc-800 dark:text-zinc-200 text-sm">
            {/* Candidate Header */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
                  {personalInfo.name}
                </h1>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  {personalInfo.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Bulacan State University &bull; {personalInfo.location}
                </p>
              </div>

              <div className="text-xs font-mono space-y-1 text-zinc-600 dark:text-zinc-400 sm:text-right">
                <p>{personalInfo.email}</p>
                <p>{personalInfo.github}</p>
                <p>{personalInfo.linkedin}</p>
              </div>
            </div>

            {/* Profile Summary */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                Executive Profile
              </h4>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs sm:text-sm">
                {personalInfo.bio} {personalInfo.aboutExtended}
              </p>
            </div>

            {/* Education */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                <GraduationCap size={15} />
                <span>Education</span>
              </h4>
              <div className="space-y-2.5">
                {educationData.map((edu, eIdx) => (
                  <div key={eIdx} className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-white text-sm">
                          {edu.degree}
                        </h5>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                          {edu.institution} &bull; {edu.specialization}
                          {edu.distinction && (
                            <span className="ml-2 font-semibold text-amber-500 font-mono text-[11px]">
                              ({edu.distinction})
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {edu.period}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Proficiencies */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                <Code size={15} />
                <span>Technical Skills</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skillCategories.map((c) => (
                  <div key={c.title} className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white mb-1.5">
                      {c.title}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {c.skills.map((s) => {
                        const skillName = typeof s === 'string' ? s : s.name;
                        return (
                          <span key={skillName} className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300">
                            {skillName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Projects in CV */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                <Briefcase size={15} />
                <span>Featured Project Highlights</span>
              </h4>
              <div className="space-y-2.5">
                {projectList.slice(0, 3).map((p) => (
                  <div key={p.id} className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-zinc-900 dark:text-white">{p.title}</span>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{p.category}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-normal">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CVModal;
