import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, Cpu, QrCode, Sparkles } from 'lucide-react';

const SwingingBadge = () => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // 2D Motion values for free movement in X and Y
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Physics springs with realistic mass and pendulum damping
  const smoothX = useSpring(dragX, { stiffness: 180, damping: 14, mass: 1.2 });
  const smoothY = useSpring(dragY, { stiffness: 200, damping: 15, mass: 1.1 });

  // 1. Angular rotation derived from horizontal displacement (pivoting from top anchor)
  const lanyardRotate = useTransform(smoothX, [-180, 180], [-26, 26]);

  // 2. Secondary card swivel lag at the metal ring
  const cardSecondaryRotate = useTransform(smoothX, [-180, 180], [-10, 10]);

  // 3. 3D perspective tilt as the badge moves in 2D space
  const cardRotateY = useTransform(smoothX, [-180, 180], [-16, 16]);
  const cardRotateX = useTransform(smoothY, [-140, 160], [18, -12]);

  // 4. Cloth ribbon reaction:
  // When pushed up (smoothY < 0), cloth bows/slackens. When pulled down (smoothY > 0), cloth tenses.
  const ribbonScaleY = useTransform(smoothY, [-140, 0, 160], [0.72, 1, 1.28]);
  const ribbonBow = useTransform(smoothY, [-140, 0, 160], [28, 0, -4]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center select-none pt-0 pb-6"
      style={{ perspective: 1200 }}
    >
      {/* 
        Top anchor positioned behind the sticky top navbar.
        Navbar is sticky top-0 z-50; this container sits at z-20 so the lace emerges naturally from behind the nav.
      */}
      <div className="relative -mt-16 sm:-mt-20 z-20 flex flex-col items-center">
        
        {/* Top Lace Entry Point (disappears behind top navigation) */}
        <div className="w-16 h-4 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-b-md shadow-md border-t border-zinc-700/50 flex items-center justify-center opacity-80">
          <div className="w-8 h-1 bg-zinc-950 rounded-full" />
        </div>

        {/* 
          Pendulum Assembly:
          Pivots from top center (origin-top), with full 2D drag physics (X and Y)
        */}
        <motion.div
          className="relative flex flex-col items-center cursor-grab active:cursor-grabbing origin-top"
          drag
          dragConstraints={{ left: -160, right: 160, top: -140, bottom: 180 }}
          dragElastic={0.25}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => {
            setIsDragging(false);
            dragX.set(0);
            dragY.set(0);
          }}
          style={{
            x: smoothX,
            y: smoothY,
            rotate: lanyardRotate,
            transformOrigin: 'top center',
          }}
          animate={
            !isDragging
              ? {
                  rotate: [0, 1.5, -1.5, 0.8, -0.8, 0],
                  y: [0, -2, 0, -1.5, 0],
                  transition: {
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }
              : {}
          }
        >
          {/* Lanyard Fabric Ribbon */}
          <div className="relative flex flex-col items-center">
            {/* Long realistic fabric ribbon reaching from behind the navbar */}
            <motion.div
              style={{
                scaleY: ribbonScaleY,
                transformOrigin: 'top center',
                skewX: ribbonBow,
              }}
              className="relative w-8 h-44 sm:h-52 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 border-x-2 border-emerald-950 shadow-xl flex flex-col items-center overflow-hidden transition-transform duration-75"
            >
              {/* Fabric texture weave */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />

              {/* Repeating vertical branded text: NAMME • NAMME • NAMME */}
              <div className="flex flex-col items-center justify-around h-full py-2 text-[9px] font-black tracking-widest text-emerald-100/90 [writing-mode:vertical-lr] rotate-180 select-none">
                <span>NAMME</span>
                <span className="text-[7px] text-emerald-300">•</span>
                <span>NAMME</span>
                <span className="text-[7px] text-emerald-300">•</span>
                <span>NAMME</span>
                <span className="text-[7px] text-emerald-300">•</span>
                <span>NAMME</span>
              </div>

              {/* Ribbon edge borders */}
              <div className="absolute top-0 left-0 w-0.5 h-full bg-emerald-400/30" />
              <div className="absolute top-0 right-0 w-0.5 h-full bg-emerald-950/60" />
            </motion.div>

            {/* Metallic Clasp & Swivel Hardware */}
            <div className="flex flex-col items-center -mt-0.5 z-10">
              {/* Metal Crimp Bar */}
              <div className="w-9 h-2.5 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 rounded-xs shadow border border-zinc-500" />
              
              {/* Chrome Lobster Swivel Clasp */}
              <div className="w-5 h-7 bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 rounded-b-lg border border-zinc-400 shadow-md flex items-center justify-center relative">
                <div className="w-1.5 h-3.5 bg-zinc-600 rounded-full" />
              </div>

              {/* Metal Ring passing through the badge card slot */}
              <div className="w-4 h-4 border-2 border-zinc-300 rounded-full -mt-1 shadow-sm" />
            </div>
          </div>

          {/* ID Card Badge with 3D Tilt & Secondary Swivel */}
          <motion.div
            style={{
              rotateZ: cardSecondaryRotate,
              rotateX: cardRotateX,
              rotateY: cardRotateY,
              transformOrigin: 'top center',
            }}
            whileHover={{ scale: 1.02 }}
            className="relative -mt-2 w-[280px] sm:w-[310px] rounded-2xl p-[1px] bg-gradient-to-b from-zinc-500 via-zinc-400 to-zinc-700 shadow-2xl transition-shadow duration-300 hover:shadow-emerald-500/15 cursor-grab active:cursor-grabbing"
          >
            {/* Card Body */}
            <div className="relative w-full rounded-2xl bg-[#18181b]/95 text-zinc-100 border border-zinc-800 p-5 backdrop-blur-xl overflow-hidden shadow-inner">
              {/* Glossy / Holographic Sheen Layer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/5 to-cyan-500/10 pointer-events-none" />

              {/* Top Badge Slot Hole */}
              <div className="w-12 h-2.5 mx-auto bg-zinc-950 rounded-full border border-zinc-700/80 shadow-inner mb-3" />

              {/* Card Header: Bulacan State University Brand & Logo */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xs">
                    BSU
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-200">
                      Bulacan State Univ.
                    </p>
                    <p className="text-[8px] font-mono text-emerald-400 uppercase tracking-tight">
                      College of Info &amp; Tech
                    </p>
                  </div>
                </div>

                {/* RFID Symbol */}
                <div className="flex items-center gap-1 text-zinc-400">
                  <Cpu size={14} className="text-zinc-400" />
                  <span className="text-[8px] font-mono">RFID</span>
                </div>
              </div>

              {/* Photo & Overlay Label */}
              <div className="mt-4 flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-2xl p-1 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg group">
                  <div className="w-full h-full rounded-xl bg-zinc-800 overflow-hidden flex flex-col items-center justify-center relative">
                    {/* User's Profile Photo */}
                    <img
                      src="/profile.jpg"
                      alt="Emmanuel Nantes"
                      className="w-full h-full object-cover object-top pointer-events-none select-none"
                      draggable={false}
                    />

                    {/* Photo Overlay Label */}
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 backdrop-blur-xs py-0.5 text-center">
                      <span className="text-[9px] font-black tracking-wider text-white uppercase flex items-center justify-center gap-1">
                        <Sparkles size={10} /> DEVELOPER
                      </span>
                    </div>
                  </div>

                  {/* Corner Status Dot */}
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center shadow">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </div>
                </div>

                {/* Developer Details */}
                <div className="mt-3 text-center">
                  <h3 className="text-base font-extrabold text-white tracking-tight">
                    Emmanuel Nantes
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400 font-mono mt-0.5">
                    BSIT &bull; Web &amp; Mobile Dev
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Bulacan State University
                  </p>
                </div>
              </div>

              {/* Credential Barcode & Status */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                {/* Barcode */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-[2px] h-6">
                    {[3, 1, 4, 1, 2, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4].map((w, i) => (
                      <div
                        key={i}
                        className="h-full bg-zinc-300 rounded-[1px]"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500 tracking-wider mt-1">
                    ID: BSU-IT-2023-9941
                  </span>
                </div>

                {/* QR / Verified Badge */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/60">
                  <QrCode size={18} className="text-emerald-400" />
                  <div className="flex flex-col text-left">
                    <span className="text-[7px] font-mono text-zinc-400 uppercase">STATUS</span>
                    <span className="text-[8px] font-bold text-emerald-400 leading-none">ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Bottom Accent Banner */}
              <div className="mt-3 py-1 px-2 rounded-md bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center gap-1 text-[9px] font-mono text-emerald-300">
                <ShieldCheck size={12} />
                <span>Official Student Developer Pass</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default SwingingBadge;
