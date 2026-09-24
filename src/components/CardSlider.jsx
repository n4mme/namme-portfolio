import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Sparkles, CheckCircle2, Download } from 'lucide-react';

/**
 * Sample mock items for standalone modular usage
 */
export const sampleMockItems = [
  {
    id: 1,
    title: "Kingdom Break",
    category: "Mobile",
    description: "An action-packed 2D platformer developed using Unity and C#, featuring responsive 2D physics, intricate level design, dynamic enemy encounters, and mobile touch optimization.",
    tags: ["C#", "Unity", "2D Physics", "Game Dev"],
    demoUrl: "https://kingdom-break.vercel.app/",
    demoLabel: "Live Preview",
    githubUrl: null,
    image: "/kingdom-break.jpg",
    imagePosition: "object-[center_15%]",
    featured: true,
    stats: "Assistant Programmer & Level Designer • Made with Unity",
    role: "Role: Assistant Programmer & Level Designer"
  },
  {
    id: 2,
    title: "Library Management System",
    category: "Desktop App",
    description: "A Java-based desktop application developed as a collaborative team project for streamlining institutional library administration, cataloging books, and managing circulation records.",
    tags: ["Java", "OOP", "Desktop Application", "Database Management"],
    demoUrl: null,
    githubUrl: "https://github.com/Luckyyy-spd/LibraryManagementSystem.git",
    image: "/library-management.png",
    imagePosition: "object-top",
    featured: true,
    stats: "Collaborative Team Project • Java Desktop Application",
    role: "Java Desktop Application • Team Project"
  },
  {
    id: 3,
    title: "Biyahele",
    category: "Full Stack",
    description: "An Airbnb-inspired full-stack web application designed for seamless travel and stay bookings, centralizing booking operations, real-time availability, and secure transactions.",
    tags: ["React", "Vite", "Firebase Auth", "Firestore", "PayPal API"],
    demoUrl: "https://biyahele.web.app/",
    demoLabel: "Live Preview",
    githubUrl: null,
    image: "/biyahele.png",
    imagePosition: "object-top",
    featured: true,
    stats: "Full Stack Developer • Firebase & PayPal Integration",
    role: "Role: Full Stack Developer"
  },
  {
    id: 4,
    title: "GOMS Output - School Mobile Application",
    category: "UI/UX Design",
    description: "A school mobile application UI/UX project designed in Figma, featuring a clean and modern interface with onboarding, sign-in, account creation, and user-focused mobile navigation.",
    tags: ["Figma", "Mobile App", "UI/UX Design", "Prototyping"],
    demoUrl: "https://www.figma.com/design/7lsKIkL2odBRDNEWjBuPTv/GOMS-Output?node-id=1-205&t=agy9utEao49X7q85-0",
    demoLabel: "View Figma Design",
    githubUrl: null,
    image: "/goms-output.png",
    imagePosition: "object-contain bg-zinc-950 py-3",
    featured: true,
    stats: "Figma UI/UX • Interactive Mobile Prototype",
    role: "UI/UX Designer • School Project"
  },
  {
    id: 5,
    title: "BulSU E-Handbook - Bustos Campus",
    category: "Mobile",
    description: "A proposed Android e-handbook for Bulacan State University — Bustos Campus, designed to give students quick access to campus policies, schedules, services, downloadable forms, and essential university resources.",
    tags: ["Android Studio", "Java", "Mobile Development", "APK", "Android"],
    demoUrl: "https://e-handbook-website.vercel.app/",
    demoLabel: "Download APK",
    githubUrl: null,
    image: "/bulsu-ehandbook.png",
    imagePosition: "object-cover object-center",
    featured: true,
    stats: "Android Application • 100% Offline Access",
    role: "Mobile App Developer • Android Studio"
  }
];

/**
 * Responsive 2-Item Card Carousel with infinite wrap-around slide logic
 */
const CardSlider = ({ items = sampleMockItems }) => {
  const [visibleCount, setVisibleCount] = useState(2);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Measure and adapt visible cards to viewport size (1 on mobile, 2 on desktop/tablet)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else {
        setVisibleCount(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = items.length;

  // If there are fewer or equal items than the visible slots, display in a static centered grid
  const shouldSlide = totalItems > visibleCount;

  // Cloned buffer array for infinite, continuous sliding without dead ends: [copy1, copy2, copy3]
  const extendedItems = shouldSlide ? [...items, ...items, ...items] : items;

  // Initialize track to start in the middle set of items
  const baseOffset = shouldSlide ? totalItems : 0;
  const [trackIndex, setTrackIndex] = useState(baseOffset);

  // Reset track index whenever items change (e.g. on category filtering)
  useEffect(() => {
    setTrackIndex(shouldSlide ? totalItems : 0);
    setCurrentIndex(0);
    setIsTransitioning(true);
  }, [items, shouldSlide, totalItems]);

  const handleNext = () => {
    if (!shouldSlide) return;
    setIsTransitioning(true);
    setTrackIndex((prev) => prev + 1);
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    if (!shouldSlide) return;
    setIsTransitioning(true);
    setTrackIndex((prev) => prev - 1);
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  // Seamless jump without animation once transition crosses the buffer boundary
  const handleAnimationComplete = () => {
    if (!shouldSlide) return;
    if (trackIndex >= totalItems * 2) {
      setIsTransitioning(false);
      setTrackIndex(trackIndex - totalItems);
    } else if (trackIndex < totalItems) {
      setIsTransitioning(false);
      setTrackIndex(trackIndex + totalItems);
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-4">
      {/* Navigation Arrows: Frosted Glass Effect */}
      {shouldSlide && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Project"
            className="absolute -left-4 sm:-left-7 md:-left-10 lg:-left-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md bg-zinc-900/80 hover:bg-zinc-800/95 border border-zinc-700/80 hover:border-emerald-500/60 text-zinc-200 hover:text-white shadow-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center cursor-pointer active:scale-90"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Project"
            className="absolute -right-4 sm:-right-7 md:-right-10 lg:-right-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md bg-zinc-900/80 hover:bg-zinc-800/95 border border-zinc-700/80 hover:border-emerald-500/60 text-zinc-200 hover:text-white shadow-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center cursor-pointer active:scale-90"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Carousel Track Container */}
      <div className="overflow-hidden w-full px-1 py-3">
        {shouldSlide ? (
          <motion.div
            className="flex"
            animate={{
              x: `-${trackIndex * (100 / visibleCount)}%`,
            }}
            transition={
              isTransitioning
                ? { type: 'spring', stiffness: 280, damping: 28 }
                : { duration: 0 }
            }
            onAnimationComplete={handleAnimationComplete}
          >
            {extendedItems.map((project, idx) => (
              <div
                key={`${project.id}-${idx}`}
                style={{ width: `${100 / visibleCount}%` }}
                className="flex-shrink-0 px-3 sm:px-4 flex"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="w-full flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] transition-all group overflow-hidden"
                >
                  {/* Card Image Cover */}
                  {project.image && (
                    <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 group/img">
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`w-full h-full object-cover ${project.imagePosition || 'object-top'} group-hover:scale-105 transition-transform duration-700 ease-out`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-70" />

                      {/* Directory / Action Button in Top Right of Picture */}
                      {(project.demoUrl || project.githubUrl) && (
                        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-zinc-900/85 hover:bg-emerald-600 backdrop-blur-md border border-white/15 hover:border-emerald-500/50 shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] active:scale-95 transition-all cursor-pointer group/btn"
                            >
                              <Github size={13} />
                              <span>Source Code</span>
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-zinc-900/85 hover:bg-emerald-600 backdrop-blur-md border border-white/15 hover:border-emerald-500/50 shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] active:scale-95 transition-all cursor-pointer group/btn"
                            >
                              <span>{project.demoLabel || "Live Preview"}</span>
                              {project.demoLabel?.toLowerCase().includes('download') ? (
                                <Download size={13} className="group-hover/btn:translate-y-0.5 transition-transform" />
                              ) : (
                                <ExternalLink size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              )}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Top Card Body */}
                  <div className="p-6 sm:p-7 flex-grow flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <Sparkles size={12} /> Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-auto pt-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={14} className="shrink-0" />
                        <span className="truncate">{project.stats}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
                      {project.role}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      <span>{project.category}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* Static Centered Grid for 1 or 2 items (e.g. filtered categories) */
          <div
            className={`grid gap-6 sm:gap-8 ${
              totalItems === 1
                ? 'grid-cols-1 max-w-2xl mx-auto w-full'
                : 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto w-full'
            }`}
          >
            {items.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] transition-all group overflow-hidden"
              >
                {/* Card Image Cover */}
                {project.image && (
                  <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 group/img">
                    <img
                      src={project.image}
                      alt={project.title}
                      className={`w-full h-full object-cover ${project.imagePosition || 'object-top'} group-hover:scale-105 transition-transform duration-700 ease-out`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-70" />

                    {/* Directory / Action Button in Top Right of Picture */}
                    {(project.demoUrl || project.githubUrl) && (
                      <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-zinc-900/85 hover:bg-emerald-600 backdrop-blur-md border border-white/15 hover:border-emerald-500/50 shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] active:scale-95 transition-all cursor-pointer group/btn"
                          >
                            <Github size={13} />
                            <span>Source Code</span>
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-zinc-900/85 hover:bg-emerald-600 backdrop-blur-md border border-white/15 hover:border-emerald-500/50 shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] active:scale-95 transition-all cursor-pointer group/btn"
                          >
                            <span>{project.demoLabel || "Live Preview"}</span>
                            {project.demoLabel?.toLowerCase().includes('download') ? (
                              <Download size={13} className="group-hover/btn:translate-y-0.5 transition-transform" />
                            ) : (
                              <ExternalLink size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            )}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Top Card Body */}
                <div className="p-6 sm:p-7 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Sparkles size={12} /> Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>{project.stats}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
                    {project.role}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>{project.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Slide Position Indicator Dots */}
      {shouldSlide && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {items.map((item, dotIdx) => (
            <button
              key={item.id}
              onClick={() => {
                setIsTransitioning(true);
                setTrackIndex(totalItems + dotIdx);
                setCurrentIndex(dotIdx);
              }}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === dotIdx
                  ? 'w-7 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                  : 'w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardSlider;
