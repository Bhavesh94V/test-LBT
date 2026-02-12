'use client';

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Phone, Mail, User, LogOut, Instagram, Linkedin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import OTPAuthModal from '@/components/auth/OTPAuthModal';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileDropdown from './UserProfileDropdown';
// Logo placeholder - no image file available
const logo = "";

// --- Brand Colors ---
const BRAND_RED = "#D92228";

// --- Mega Menu Data ---
const megaMenuData = {
  properties: {
    title: "Real Estate Collection",
    links: [
      { name: "All Properties", href: "/properties", desc: "View our complete listing inventory." },
      { name: "Under Construction", href: "/properties?filter=under-construction", desc: "Invest early for maximum returns." },
      { name: "Ready to Move", href: "/properties?filter=ready", desc: "Immediate possession homes." },
      { name: "Trending Deals", href: "/properties?sort=trending", desc: "High demand group buys." },
    ],
    featured: {
      title: "Featured Project",
      name: "The Aristo Sky-Villas",
      location: "South Mumbai",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
    }
  },
  resources: {
    title: "Knowledge Hub",
    links: [
      { name: "How It Works", href: "/how-it-works", desc: "Understand our group buying model." },
      { name: "Blogs & Articles", href: "/blogs", desc: "Market insights and buying tips." },
      { name: "FAQs", href: "/faqs", desc: "Common questions answered." },
      { name: "About Us", href: "/about", desc: "Our mission and vision." },
    ],
    featured: {
      title: "Latest Editorial",
      name: "2026 Market Outlook",
      location: "5 Min Read",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"
    }
  }
};

const Header: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll Logic to collapse Top Bar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* --- THE LIGHT DIMMER --- */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-white/60 backdrop-blur-sm"
            onMouseEnter={() => setActiveMenu(null)}
          />
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">

        {/* --- LEVEL 1: THE MINI HEADER (Light System Bar) --- */}
        <motion.div
          initial={{ height: 40, opacity: 1 }}
          animate={{
            height: isScrolled ? 0 : 40,
            opacity: isScrolled ? 0 : 1,
            marginBottom: isScrolled ? 0 : 0
          }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          className="w-full bg-stone-50 border-b border-stone-200 relative z-50 hidden md:block overflow-hidden pointer-events-auto"
        >
          <div className="container-section h-full flex items-center justify-between text-[11px] font-medium tracking-wide text-stone-600">

            {/* Left: Tagline */}
            <div className="flex items-center gap-4">
              <span className="text-[#D92228] flex items-center gap-1.5 font-bold uppercase tracking-wider">
                Join Us
              </span>
              <div className="h-3 w-[1px] bg-stone-300" />
              <span className="italic text-stone-800">
                “Buying alone works. Buying together works better.”
              </span>
            </div>

            {/* Right: Socials & Contact */}
            <div className="flex items-center gap-6">
              {/* Social Icons */}
              <div className="flex items-center gap-3 pr-6 border-r border-stone-300">
                <a href="#" className="hover:text-[#D92228] transition-colors" title="Instagram">
                  <Instagram size={12} />
                </a>
                <a href="#" className="hover:text-[#D92228] transition-colors" title="LinkedIn">
                  <Linkedin size={12} />
                </a>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-4">
                <a href="mailto:hello@letsbuy.com" className="hover:text-[#D92228] transition-colors flex items-center gap-1.5">
                  <Mail size={12} /> hello@letsbuy.com
                </a>
                <span className="text-stone-300">|</span>
                <a href="tel:+919876543210" className="hover:text-[#D92228] transition-colors flex items-center gap-1.5">
                  <Phone size={12} /> +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- LEVEL 2: THE MAIN GLASS DECK (Light & Architectural) --- */}
        <motion.header
          layout
          className={`w-full border-b transition-all duration-500 relative z-50 pointer-events-auto
            ${isScrolled || activeMenu
              ? 'bg-white/90 backdrop-blur-xl border-stone-200 shadow-sm'
              : 'bg-white/70 backdrop-blur-md border-white/40 shadow-sm'
            }
          `}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="container-section flex items-center justify-between h-20">

            {/* --- LOGO SECTION (UPDATED) --- */}
            {/* Added shrink-0 to prevent squashing on mobile */}
            <div className="flex items-center h-full border-r border-stone-200 pr-6 mr-6 md:pr-8 md:mr-8 shrink-0">
              <Link to="/" className="flex items-center gap-3 group">

                <div className="flex flex-col">
                  <span className="font-bold text-xl text-stone-900 leading-none tracking-tight">Let's Buy</span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mt-0.5 group-hover:text-[#D92228] transition-colors">Group Buying</span>
                </div>
              </Link>
            </div>

            {/* Navigation Triggers */}
            <nav className="hidden lg:flex items-center gap-1 h-full mr-auto">
              {[
                { name: "Home", href: "/", type: "link" },
                { name: "About Us", href: "/about", type: "link" },
                { name: "Properties", id: "properties", type: "button" },
                { name: "Resources", id: "resources", type: "button" },
                { name: "Contact", href: "/contact", type: "link" }
              ].map((item) => (
                item.type === 'link' ? (
                  <Link
                    key={item.name}
                    to={item.href!}
                    className="px-5 py-2 text-sm font-medium text-stone-600 hover:text-[#D92228] hover:bg-red-50/50 rounded-md transition-all"
                    onMouseEnter={() => setActiveMenu(null)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    className={`px-5 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-1
                      ${activeMenu === item.id
                        ? 'bg-stone-100 text-[#D92228] shadow-inner'
                        : 'text-stone-600 hover:text-[#D92228] hover:bg-red-50/50'
                      }
                      `}
                    onMouseEnter={() => setActiveMenu(item.id!)}
                  >
                    {item.name} <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === item.id ? 'rotate-180 text-[#D92228]' : ''}`} />
                  </button>
                )
              ))}
            </nav>

            {/* Actions Block */}
            <div className="hidden lg:flex items-center gap-4 pl-8 border-l border-stone-200 h-full">
              {isAuthenticated ? (
                <UserProfileDropdown />
              ) : (
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="rounded-sm bg-stone-900 hover:bg-[#D92228] text-white px-6 font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Log In
                </Button>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>

          {/* --- THE MEGA CURTAIN (Light Mode) --- */}
          <AnimatePresence>
            {activeMenu && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-xl overflow-hidden"
              >
                {/* Thin Red Accent Line */}
                <div className="h-[2px] w-full bg-[#D92228]" />

                <div className="container-section py-12">
                  {['properties', 'resources'].map((menuType) => {
                    if (activeMenu !== menuType) return null;
                    const data = megaMenuData[menuType as keyof typeof megaMenuData];

                    return (
                      <motion.div
                        key={menuType}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-12 gap-12"
                      >
                        {/* Info Column */}
                        <div className="col-span-3 border-r border-stone-100 pr-8 pt-2">
                          <span className="text-[#D92228] font-mono text-[10px] uppercase tracking-widest mb-4 block">
                            Navigation
                          </span>
                          <h3 className="text-3xl  text-stone-900 mb-4 leading-tight">{data.title}</h3>
                          <Link to="/contact" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-[#D92228] transition-colors border-b border-stone-200 pb-1">
                            Need Help? Contact Support <ArrowRight size={12} className="ml-2" />
                          </Link>
                        </div>

                        {/* Links Grid */}
                        <div className="col-span-5 grid grid-cols-1 gap-4">
                          {data.links.map((link, idx) => (
                            <Link
                              key={idx}
                              to={link.href}
                              className="group flex items-start gap-4 p-4 rounded-lg hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100"
                            >
                              <div className="mt-1 w-8 h-8 rounded-sm bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-[#D92228] group-hover:text-white transition-all">
                                <ArrowRight size={14} className="group-hover:-rotate-45 transition-transform" />
                              </div>
                              <div>
                                <h4 className="font-medium text-stone-900 text-sm group-hover:text-[#D92228] transition-colors">{link.name}</h4>
                                <p className="text-[11px] text-stone-500 mt-0.5 font-light">{link.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {/* Visual Column */}
                        <div className="col-span-4 pl-4 border-l border-stone-100">
                          <div className="relative group cursor-pointer overflow-hidden rounded-md h-full min-h-[200px] shadow-sm hover:shadow-md transition-shadow">
                            <img
                              src={data.featured.image || "/placeholder.svg"}
                              alt="Featured"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/10 to-transparent" />
                            <div className="absolute bottom-0 left-0 w-full p-6">
                              <span className="bg-[#D92228] text-white text-[9px] font-bold uppercase px-2 py-1 rounded-sm mb-2 inline-block">
                                Featured
                              </span>
                              <h4 className="text-white text-lg  mb-1">{data.featured.name}</h4>
                              <span className="text-white/80 text-xs flex items-center gap-2">
                                {data.featured.location}
                              </span>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white lg:hidden flex flex-col pt-16"
          >
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <span className="text-xl  font-bold text-stone-900">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-stone-100 rounded-full text-stone-600">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-6">
                <Link to="/" className="text-2xl  text-stone-900 block" onClick={() => setMobileMenuOpen(false)}>Home</Link>

                {['Properties', 'Resources'].map((section) => (
                  <div key={section}>
                    <div className="text-xs font-mono text-[#D92228] uppercase tracking-widest mb-4">{section}</div>
                    <div className="space-y-4 pl-4 border-l border-stone-200">
                      {megaMenuData[section.toLowerCase() as keyof typeof megaMenuData].links.map(l => (
                        <Link key={l.name} to={l.href} onClick={() => setMobileMenuOpen(false)} className="block text-lg text-stone-600 font-light hover:text-[#D92228]">{l.name}</Link>
                      ))}
                    </div>
                  </div>
                ))}

                <Link to="/contact" className="text-2xl  text-stone-900 block" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              </div>

              <div className="pt-8 border-t border-stone-100">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <Link to="/profile" className="flex items-center gap-3 text-lg font-medium text-stone-900" onClick={() => setMobileMenuOpen(false)}>
                      <User size={20} /> My Profile
                    </Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-lg font-medium text-[#D92228]">
                      <LogOut size={20} /> Logout
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}
                    className="w-full h-14 text-lg bg-[#D92228] text-white rounded-sm shadow-xl"
                  >
                    Log In
                  </Button>
                )}
                {/* Mobile Socials */}
                <div className="flex gap-4 mt-8 pt-4 border-t border-stone-100 justify-center">
                  <a href="#" className="text-stone-400 hover:text-[#D92228]"><Instagram size={20} /></a>
                  <a href="#" className="text-stone-400 hover:text-[#D92228]"><Linkedin size={20} /></a>
                  <a href="mailto:hello@letsbuy.com" className="text-stone-400 hover:text-[#D92228]"><Mail size={20} /></a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <OTPAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
