'use client';

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, RefreshCcw, Home, Construction, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Brand Colors ---
const BRAND_RED = "#D92228";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scanLine, setScanLine] = useState(0);

  // Mouse Tracking for Parallax & Coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the "Floating Block"
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [0, window.innerHeight], [20, -20]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, window.innerWidth], [-20, 20]), springConfig);

  // Live Coordinates State
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [location.pathname, mouseX, mouseY]);

  // Radar Scan Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-stone-50 flex flex-col items-center justify-center font-sans">

      {/* --- LAYER 1: ARCHITECTURAL GRID BACKGROUND --- */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* --- LAYER 2: RADAR SCANNER EFFECT --- */}
      {/* A sweeping gradient simulating a search for the missing page */}
      <div
        className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-20"
        style={{
          background: `conic-gradient(from ${scanLine * 3.6}deg at 50% 50%, transparent 0deg, transparent 300deg, rgba(0,0,0,0.1) 360deg)`
        }}
      />

      {/* --- LAYER 3: TECHNICAL HUD OVERLAY --- */}
      <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-10 text-[10px] font-mono text-stone-400 uppercase tracking-widest">
        {/* <div className="flex justify-between">
          <span>ERR_CODE: 404_NOT_FOUND</span>
          <span>SYS_STATUS: CRITICAL_MISSING_DATA</span>
        </div> */}

        {/* <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <span>TARGET_LOC: {location.pathname}</span>
            <span>CURSOR_POS: X{coords.x} / Y{coords.y}</span>
          </div>
          <span>LETS_BUY_SYNDICATE_V2.0</span>
        </div> */}

        {/* Crosshair Lines */}
        <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-red-500/50" />
        <div className="absolute top-1/2 right-0 w-4 h-[1px] bg-red-500/50" />
        <div className="absolute top-0 left-1/2 w-[1px] h-4 bg-red-500/50" />
        <div className="absolute bottom-0 left-1/2 w-[1px] h-4 bg-red-500/50" />
      </div>

      {/* --- MAIN CONTENT: THE 3D GLITCH CUBE --- */}
      <div className="relative z-20 perspective-1000">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative flex flex-col items-center justify-center p-12"
        >
          {/* The "404" Construction Block */}
          <div className="relative text-[12rem] md:text-[16rem] leading-none font-black font-mono tracking-tighter text-transparent select-none">

            {/* Back Shadow Layer */}
            <span
              className="absolute inset-0 text-stone-200/50"
              style={{ transform: "translateZ(-50px)" }}
            >
              404
            </span>

            {/* Main Text Layer with Stroke */}
            <span
              className="relative z-10 block"
              style={{
                WebkitTextStroke: "2px #292524", // Stone-800 Stroke
                transform: "translateZ(0px)"
              }}
            >
              404
            </span>

            {/* Glitch Overlay (Simulates Broken Blueprint) */}
            <motion.span
              animate={{ x: [-2, 2, -2], opacity: [0.8, 0.4, 0.8] }}
              transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 3 }}
              className="absolute inset-0 text-[#D92228]/20 mix-blend-multiply blur-sm"
              style={{ transform: "translateZ(20px)" }}
            >
              404
            </motion.span>

            {/* Floating Construction Icon */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-0 right-10 bg-white p-4 rounded-full border border-stone-200 shadow-xl"
              style={{ transform: "translateZ(60px)" }}
            >
              <Construction size={32} className="text-[#D92228]" />
            </motion.div>

          </div>

          {/* Message Box */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center bg-white/80 backdrop-blur-md p-8 border border-stone-200 shadow-2xl max-w-md relative"
            style={{ transform: "translateZ(40px)" }}
          >
            {/* Decorative tape effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#D92228]/10 border border-[#D92228]/20 rotate-[-2deg]" />

            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
              Blueprint Not Found
            </h2>
            <p className="text-stone-500 mb-8 font-light leading-relaxed">
              The coordinates you entered point to an undeveloped sector. The page might have been moved or demolished.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/')}
                className="h-12 px-8 rounded-none bg-stone-900 hover:bg-[#D92228] text-white transition-all shadow-lg hover:shadow-xl font-mono uppercase text-xs tracking-widest"
              >
                <Home size={14} className="mr-2" /> Return Home
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="h-12 px-8 rounded-none border-stone-300 hover:border-stone-900 text-stone-600 hover:text-stone-900 font-mono uppercase text-xs tracking-widest"
              >
                <RefreshCcw size={14} className="mr-2" /> Reload System
              </Button>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* --- SEARCH SUGGESTION (Bottom) --- */}
      <div className="absolute bottom-12 z-20">
        <p className="text-stone-400 text-xs uppercase tracking-widest mb-2 text-center">Lost? Try Searching</p>
        <div className="flex items-center bg-white border border-stone-200 rounded-full px-4 py-2 shadow-sm w-64 group focus-within:border-[#D92228] transition-colors">
          <Search size={14} className="text-stone-400 group-focus-within:text-[#D92228]" />
          <input
            type="text"
            placeholder="Search properties..."
            className="ml-3 bg-transparent outline-none text-sm text-stone-600 placeholder:text-stone-300 w-full"
          />
        </div>
      </div>

    </div>
  );
};

export default NotFound;
