import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, Cpu, Code2, QrCode, Sparkles, UserCheck } from 'lucide-react';

const SwingingBadge = () => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Motion values for physical pendulum mechanics
  const dragX = useMotionValue(0);

  // Derive rotation from horizontal drag displacement (pivoting around top clip)
  const rawRotation = useTransform(dragX, [-150, 150], [-24, 24]);
  const smoothRotation = useSpring(rawRotation, {
    stiffness: 280,
    damping: 14,
    mass: 1.2
  });

  const smoothX = useSpring(dragX, {
    stiffness: 280,
    damping: 15,
    mass: 1.2
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center select-none py-2"
    >
      {/* Pendulum Rig anchored at the top */}
      <motion.div
        className="relative flex flex-col items-center cursor-grab active:cursor-grabbing origin-top"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{
          x: smoothX,
          rotate: smoothRotation,
          transformOrigin: 'top center',
        }}
        whileHover={{ scale: 1.01 }}
        animate={
          !isDragging
            ? {
                rotate: [0, 1.8, -1.8, 1.2, -1.2, 0],
                transition: {
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
            : {}
        }
      >
        {/* Lanyard / ID Lace Hanging down from top */}
        <div className="relative flex flex-col items-center">
          {/* Lanyard Ceiling Anchor */}
          <div className="w-12 h-3.5 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-b-md shadow-md border-t border-zinc-600 flex items-center justify-center">
            <div className="w-6 h-1 bg-zinc-900 rounded-full" />
          </div>

          {/* Styled Fabric Ribbon with repeating branded text */}
          <div className="relative w-8 h-28 sm:h-32 bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 border-x-2 border-emerald-950 shadow-lg flex flex-col items-center overflow-hidden">
            {/* Fabric texture weave effect */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />
            
            {/* Repeating vertical branded text: NAMME • NAMME • NAMME */}
            <div className="flex flex-col items-center justify-around h-full py-1 text-[9px] font-black tracking-widest text-emerald-100/90 [writing-mode:vertical-lr] rotate-180 select-none">
              <span>NAMME</span>
              <span className="text-[7px] text-emerald-300">•</span>
              <span>NAMME</span>
              <span className="text-[7px] text-emerald-300">•</span>
              <span>NAMME</span>
            </div>

            {/* Subtle ribbon edge highlights */}
            <div className="absolute top-0 left-0 w-0.5 h-full bg-emerald-400/30" />
            <div className="absolute top-0 right-0 w-0.5 h-full bg-emerald-950/50" />
          </div>

          {/* Metallic Clip & Swivel Connector */}
          <div className="flex flex-col items-center -mt-0.5 z-20">
            {/* Metal Swivel Bar */}
            <div className="w-9 h-2.5 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400 rounded-sm shadow border border-zinc-500" />
            
            {/* Chrome Hook / Lobster Clasp */}
            <div className="w-5 h-6 bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 rounded-b-lg border border-zinc-400 shadow flex items-center justify-center relative">
              {/* Clasp lever notch */}
              <div className="w-1.5 h-3 bg-zinc-600 rounded-full" />
            </div>

            {/* Ring passing through the badge slot hole */}
            <div className="w-3.5 h-4 border-2 border-zinc-300 rounded-full -mt-1 shadow-sm" />
          </div>
        </div>

        {/* ID Card Badge Container */}
        <div className="relative -mt-2 w-[270px] sm:w-[300px] rounded-2xl p-[1px] bg-gradient-to-b from-zinc-600 via-zinc-400 to-zinc-700 shadow-2xl transition-shadow duration-300 hover:shadow-emerald-500/10">
          {/* Main Card Body */}
          <div className="relative w-full rounded-2xl bg-zinc-900/95 text-zinc-100 border border-zinc-800 p-5 backdrop-blur-xl overflow-hidden shadow-inner">
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
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                    Bulacan State Univ.
                  </p>
                  <p className="text-[8px] font-mono text-emerald-400 uppercase tracking-tight">
                    College of Info & Tech
                  </p>
                </div>
              </div>

              {/* RFID / Contactless Chip Symbol */}
              <div className="flex items-center gap-1 text-zinc-400">
                <Cpu size={14} className="text-zinc-400" />
                <span className="text-[8px] font-mono">RFID</span>
              </div>
            </div>

            {/* Photo Placeholder & Overlay Label */}
            <div className="mt-4 flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-2xl p-1 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg group">
                <div className="w-full h-full rounded-xl bg-zinc-800 overflow-hidden flex flex-col items-center justify-center relative">
                  {/* Stylized Developer Avatar Placeholder */}
                  <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-zinc-950 flex flex-col items-center justify-center p-2 text-center">
                    <div className="w-14 h-14 rounded-full bg-zinc-700/80 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-1 shadow-inner">
                      <Code2 size={28} />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400">DEV.AVATAR</span>
                  </div>

                  {/* Profile photo overlay label */}
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 backdrop-blur-xs py-0.5 text-center">
                    <span className="text-[9px] font-black tracking-wider text-white uppercase flex items-center justify-center gap-1">
                      <Sparkles size={10} /> DEVELOPER
                    </span>
                  </div>
                </div>

                {/* Corner Status Pill */}
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
                  BSIT &bull; Web & Mobile Dev
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Bulacan State University
                </p>
              </div>
            </div>

            {/* Credential Barcode & Meta Details */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              {/* Simulated ID Barcode */}
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
        </div>
      </motion.div>

      {/* Physics drag guidance hint */}
      <motion.div
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="mt-4 flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700/60"
      >
        <span className="text-emerald-500 font-bold">↔</span>
        <span>Drag badge to swing</span>
      </motion.div>
    </div>
  );
};

export default SwingingBadge;
