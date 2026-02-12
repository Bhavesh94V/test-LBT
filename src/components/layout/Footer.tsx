'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Instagram, Linkedin, Twitter, MapPin, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// --- Brand Colors ---
const BRAND_RED = "#D92228";

// --- Assets ---
// Logo placeholder - replace with your actual logo image path
const HBJ_LOGO = "https://placehold.co/100x100/D92228/ffffff?text=HBJ";

// --- Components ---

// 1. Live Clock Component
const LiveClock = () => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Formatting to Ahmedabad/IST time
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setTime(now.toLocaleTimeString('en-GB', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="font-mono tabular-nums tracking-widest">{time} IST</span>;
};

// 2. Marquee Component
const InfiniteMarquee = () => {
  return (
    <div className="relative flex overflow-hidden py-4 border-t border-b border-stone-200 bg-stone-50">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-9xl font-black uppercase tracking-tighter text-stone-200 mx-8 select-none">
            Let's Buy • Together •
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// 3. Grid Cell (The Building Block)
const GridCell = ({
  children,
  className = "",
  hoverEffect = true
}: {
  children: React.ReactNode,
  className?: string,
  hoverEffect?: boolean
}) => {
  return (
    <div className={`
      relative p-8 border-r border-stone-200 overflow-hidden group transition-colors duration-500
      ${hoverEffect ? 'hover:bg-black hover:text-white' : ''} 
      ${className}
    `}>
      {children}
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-stone-900 border-t border-stone-200 relative z-20">

      {/* --- SECTION 1: THE MARQUEE --- */}
      <InfiniteMarquee />

      {/* --- SECTION 2: THE MAIN GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-stone-200">

        {/* COL 1: Brand & Newsletter (Span 6) */}
        <GridCell className="md:col-span-6 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="w-12 h-12 bg-[#D92228] text-white flex items-center justify-center font-bold text-xl mb-8">LB.</div>
            <h2 className="text-5xl md:text-6xl font-medium leading-[0.9] tracking-tight mb-6 group-hover:text-white transition-colors">
              Buying Together.<br />
              Winning Together.
            </h2>
          </div>

          <div className="mt-auto">
            <label className="text-xs font-mono font-bold uppercase tracking-widest mb-4 block group-hover:text-stone-400">Newsletter Protocol</label>
            <div className="flex border-b border-stone-300 group-hover:border-stone-600 pb-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent w-full outline-none text-lg placeholder:text-stone-400 group-hover:text-white group-hover:placeholder:text-stone-600"
              />
              <button className="text-[#D92228] font-bold uppercase text-xs tracking-wider hover:text-stone-900 group-hover:hover:text-white transition-colors">
                Join
              </button>
            </div>
          </div>
        </GridCell>

        {/* COL 2: Quick Links (Span 3) */}
        <GridCell className="md:col-span-3 flex flex-col justify-between">
          <div className="space-y-6">
            <span className="text-xs font-mono font-bold uppercase text-[#D92228] tracking-widest">Sitemap</span>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'Properties', href: '/properties' },
                { name: 'How It Works', href: '/how-it-works' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-2xl hover:text-[#D92228] transition-colors flex items-center gap-2 group-link">
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#D92228]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </GridCell>

        {/* COL 3: Contact & Data (Span 3) */}
        <div className="md:col-span-3 grid grid-rows-2">
          {/* Row 1: Address */}
          <GridCell className="border-b border-stone-200">
            <span className="text-xs font-mono font-bold uppercase text-[#D92228] tracking-widest mb-4 block">HQ Location</span>
            <address className="not-italic text-lg leading-relaxed group-hover:text-stone-300">
              <MapPin className="inline-block w-4 h-4 mb-1 mr-2 text-[#D92228]" />
              Ahmedabad,<br />
              Gujarat, India<br />
              380015
            </address>
          </GridCell>

          {/* Row 2: Contact Info */}
          <GridCell>
            <span className="text-xs font-mono font-bold uppercase text-[#D92228] tracking-widest mb-4 block">Connect</span>
            <ul className="space-y-2 text-sm group-hover:text-stone-300">
              <li className="flex items-center gap-2">
                <Phone size={14} /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} /> hello@letsbuy.in
              </li>
              <li className="flex items-center gap-2">
                <Globe size={14} /> www.letsbuy.in
              </li>
            </ul>
          </GridCell>
        </div>

      </div>

      {/* --- SECTION 3: THE UTILITY BAR (Updated) --- */}
      {/* Changed to 5 columns to accommodate the HBJ Branding nicely */}

      <div className="grid grid-cols-1 md:grid-cols-5 border-b border-stone-200">

        {/* 1. Live Time */}
        <div className="p-6 border-r border-stone-200 flex items-center justify-center md:justify-start gap-3 hover:bg-[#D92228] hover:text-white transition-colors cursor-crosshair">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <LiveClock />
        </div>

        {/* 2. HBJ SYNDICATE BRANDING (NEW) */}
        {/* Spans 2 columns for better visibility */}

        <div className="px-6 py-4 border-r border-stone-200 md:col-span-2 flex items-center justify-center gap-4 group/hbj cursor-pointer hover:bg-stone-50 transition-colors">
          <a
            href="https://hbjsyndicate.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Label (Optional: 'Backed By' or 'Member of') */}
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest hidden lg:block">
              Powered By
            </span>

            {/* The Logo Container */}
            <div className="flex items-center gap-3">
              {/* Image Logo */}
              <img
                src={HBJ_LOGO || "/placeholder.svg"}
                alt="HBJ Syndicate Logo"
                className="h-8 w-auto object-contain grayscale opacity-80 group-hover/hbj:grayscale-0 group-hover/hbj:opacity-100 transition-all duration-300"
              />

              {/* Text Logo */}
              <span className="font-bold text-stone-800 text-lg tracking-tight group-hover/hbj:text-[#D92228] transition-colors">
                HBJ Syndicate
              </span>
            </div>
          </a>
        </div>


        {/* 3. Socials */}
        <div className="p-6 border-r border-stone-200 flex items-center justify-center gap-6">
          {[
            { icon: Instagram, href: '#' },
            { icon: Twitter, href: '#' },
            { icon: Linkedin, href: '#' },
          ].map((social, i) => (
            <a key={i} href={social.href} className="text-black hover:text-[#D92228] transition-transform hover:-translate-y-1">
              <social.icon size={18} />
            </a>
          ))}
        </div>

        {/* 4. Legal */}
        <div className="p-6 flex items-center justify-center md:justify-end gap-6 text-xs font-bold uppercase tracking-wider text-stone-500">
          <a href="/privacy" className="hover:text-stone-900">Privacy</a>
          <a href="/terms" className="hover:text-stone-900">Terms</a>
        </div>

      </div>

      {/* --- SECTION 4: BIG COPYRIGHT --- */}
      <div className="py-2 text-center bg-stone-100">
        <p className="text-[10px] font-mono text-stone-400 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} Buying alone works. Buying together works <span className='text-primary'>better</span>. Let's Buy.
        </p>
      </div>

    </footer>
  );
};

export default Footer;
