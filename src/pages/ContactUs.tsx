'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { publicInquiryApi } from '@/services/userApi';

// --- Voronoi SVG Pattern ---
const VoronoiPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="voronoi" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M10,10 L50,0 L90,10 L100,50 L90,90 L50,100 L10,90 L0,50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#voronoi)" />
  </svg>
);

const ContactUs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Responsive Check
  const [isDesktop, setIsDesktop] = useState(false);

  // State to Lock Map Open via Click
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate phone format (10 digits)
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
        toast({
          title: 'Invalid Phone',
          description: 'Please enter a valid 10-digit phone number',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Call API to create contact inquiry (public, no propertyId)
      await publicInquiryApi.createContact({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/[^0-9]/g, ''),
        subject: formData.subject,
        message: formData.message,
      });

      // Success
      toast({
        title: 'Success!',
        description: 'Your inquiry has been received. We will contact you soon.',
      });

      // Reset form
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error: any) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit inquiry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- UNIFIED INTERACTION LOGIC ---
  // We use 'openingFactor' (0 = Closed, 1 = Open)
  // This value is controlled by EITHER Mouse Hover OR Click State
  const openingFactor = useMotionValue(0);

  // Smooth Physics
  const smoothFactor = useSpring(openingFactor, { damping: 20, stiffness: 100, mass: 0.8 });

  // Calculate Movement based on factor (0 to 1) -> (0px to 600px)
  const moveDistance = isDesktop ? 600 : 0;
  const leftX = useTransform(smoothFactor, [0, 1], [0, -moveDistance]);
  const rightX = useTransform(smoothFactor, [0, 1], [0, moveDistance]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop || isMapOpen) return; // Ignore hover if mobile or manually locked open

    const { clientX } = e;
    const { innerWidth } = window;
    const pct = clientX / innerWidth;

    // Strict Center Trigger (45% to 55%)
    if (pct > 0.45 && pct < 0.55) {
      openingFactor.set(1);
    } else {
      openingFactor.set(0);
    }
  };

  const handleMouseLeave = () => {
    if (isDesktop && !isMapOpen) openingFactor.set(0);
  };

  // --- CLICK HANDLERS ---
  const handleOpenClick = () => {
    setIsMapOpen(true);
    openingFactor.set(1); // Force open
  };

  const handleCloseClick = () => {
    setIsMapOpen(false);
    openingFactor.set(0); // Force close
  };

  return (
    <section
      className="relative min-h-screen w-full bg-stone-900 overflow-x-hidden font-sans selection:bg-[#D92228] selection:text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      {/* --- LAYER 0: THE CORE (The Map Beneath) --- */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1835.499680006321!2d72.65604323873957!3d23.06048504478683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x395e86d0a3993061%3A0xf236ea83db1b12e7!2sMADHUVAN%20GLORY%2C%20Krishnanagar%2C%20Nava%20Naroda%2C%20Ahmedabad%2C%20Gujarat%20382330!3m2!1d23.060817!2d72.6553997!4m5!1s0x395e86d9d5ed7701%3A0x8151b73557dd0714!2sSri%20Ram%20Tenament%2C%20Ram%20Tenament%2C%2025%2C%20Shree%20Prakash%20Society%2C%20Krishnanagar%2C%20Naroda%2C%20Ahmedabad%2C%20Gujarat%20382330!3m2!1d23.0608334!2d72.659202!5e0!3m2!1sen!2sin!4v1769685972982!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(100%) contrast(1.2) brightness(0.8)' }}
          allowFullScreen
          loading="lazy"
          title="Map Foundation"
        />
        <div className="absolute inset-0 bg-stone-900/40 pointer-events-none" />

        {/* CLOSE BUTTON (Visible only when Locked Open) */}
        <AnimatePresence>
          {isMapOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={handleCloseClick}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#D92228] text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest shadow-2xl hover:bg-white hover:text-[#D92228] transition-colors flex items-center gap-2"
            >
              <X size={18} /> Close Map
            </motion.button>
          )}
        </AnimatePresence>
      </div>


      {/* --- LAYER 1: THE TECTONIC PLATES --- */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen pointer-events-none">

        {/* === LEFT PLATE: INFO === */}
        <motion.div
          style={{ x: leftX }}
          className="w-full lg:w-[55%] bg-white relative shadow-2xl z-20 flex flex-col justify-center p-8 md:p-16 lg:py-20 pointer-events-auto"
        >
          <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-32 bg-white transform skew-x-[-6deg] origin-top translate-x-16 z-30 border-r-4 border-[#D92228]" />
          <VoronoiPattern />

          <div className="relative z-40 max-w-lg mx-auto lg:mx-0">
            <div className="inline-block mb-8">
              <span className="text-[#D92228] font-bold tracking-[0.2em] uppercase text-xs border-b-2 border-[#D92228] pb-1">
                Coordinates
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-stone-900 mb-8 leading-[0.9]">
              HEAD<br />QUARTERS.
            </h1>

            <p className="text-xl text-stone-500 font-light mb-12 leading-relaxed">
              We are grounded in Ahmedabad, but our network spans the horizon.
              <span className="text-stone-900 font-medium"> Visit us to align your vision.</span>
            </p>

            <div className="space-y-8">
              <div className="group cursor-pointer">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1 group-hover:text-[#D92228] transition-colors">Physical</h3>
                <p className="text-2xl font-serif text-stone-900">123 Business Hub, SG Highway</p>
                <p className="text-lg text-stone-500">Ahmedabad, Gujarat 380015</p>
              </div>

              <div className="group cursor-pointer">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1 group-hover:text-[#D92228] transition-colors">Digital</h3>
                <a href="mailto:hello@letsbuy.in" className="block text-2xl font-serif text-stone-900 hover:underline decoration-[#D92228] underline-offset-4">
                  hello@letsbuy.in
                </a>
                <a href="tel:+919876543210" className="block text-lg text-stone-500 mt-1">
                  +91 98765 43210
                </a>
              </div>
            </div>

            {/* CLICKABLE TRIGGER BUTTON */}
            {!isMapOpen && (
              <button
                onClick={handleOpenClick}
                className="mt-20 hidden lg:flex items-center gap-3 text-stone-400 text-sm font-mono hover:text-[#D92228] transition-colors group"
              >
                <div className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center group-hover:border-[#D92228]">
                  <ArrowRight className="w-4 h-4 animate-pulse group-hover:text-[#D92228]" />
                </div>
                <span>Click to view map / Hover Center</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* === MOBILE GAP === */}
        <div className="h-64 w-full lg:hidden pointer-events-none" />


        {/* === RIGHT PLATE: FORM === */}
        <motion.div
          style={{ x: rightX }}
          className="w-full lg:w-[45%] bg-stone-100/95 backdrop-blur-xl relative z-10 flex flex-col justify-center p-8 md:p-16 lg:pl-32 shadow-[-20px_0_50px_rgba(0,0,0,0.2)] pointer-events-auto"
        >
          <div className="max-w-md w-full mx-auto lg:mx-0">
            <h2 className="text-3xl font-bold text-stone-900 mb-2">Initiate Contact</h2>
            <p className="text-stone-500 mb-10 text-sm">Fields marked with <span className="text-[#D92228]">*</span> are mandatory for protocol.</p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-2xl border-l-4 border-green-500 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle2 className="text-green-500 w-8 h-8" />
                  <h3 className="text-xl font-bold text-stone-900">Received.</h3>
                </div>
                <p className="text-stone-500">
                  Your frequency has been acknowledged. Our agents will intercept shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-sm font-bold text-stone-900 hover:text-[#D92228] flex items-center gap-2"
                >
                  Reset Signal <ArrowUpRight size={14} />
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b-2 border-stone-300 py-3 text-stone-900 outline-none focus:border-[#D92228] transition-colors placeholder-transparent"
                    placeholder="Name"
                    id="name"
                  />
                  <label htmlFor="name" className="absolute left-0 -top-3.5 text-xs text-stone-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-stone-500 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D92228]">
                    Full Name
                  </label>
                </div>
                <div className="group relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b-2 border-stone-300 py-3 text-stone-900 outline-none focus:border-[#D92228] transition-colors placeholder-transparent"
                    placeholder="Email"
                    id="email"
                  />
                  <label htmlFor="email" className="absolute left-0 -top-3.5 text-xs text-stone-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-stone-500 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D92228]">
                    Email Address
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="group relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="peer w-full bg-transparent border-b-2 border-stone-300 py-3 text-stone-900 outline-none focus:border-[#D92228] transition-colors placeholder-transparent"
                      placeholder="Phone"
                      id="phone"
                    />
                    <label htmlFor="phone" className="absolute left-0 -top-3.5 text-xs text-stone-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-stone-500 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D92228]">
                      Phone
                    </label>
                  </div>
                  <div className="group relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="peer w-full bg-transparent border-b-2 border-stone-300 py-3 text-stone-900 outline-none focus:border-[#D92228] transition-colors placeholder-transparent"
                      placeholder="Subject"
                      id="subject"
                    />
                    <label htmlFor="subject" className="absolute left-0 -top-3.5 text-xs text-stone-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-stone-500 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D92228]">
                      Subject
                    </label>
                  </div>
                </div>
                <div className="group relative">
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b-2 border-stone-300 py-3 text-stone-900 outline-none focus:border-[#D92228] transition-colors placeholder-transparent resize-none"
                    placeholder="Message"
                    id="message"
                  />
                  <label htmlFor="message" className="absolute left-0 -top-3.5 text-xs text-stone-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-stone-500 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#D92228]">
                    Your Message
                  </label>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-stone-900 hover:bg-[#D92228] text-white rounded-none text-lg font-bold uppercase tracking-widest transition-all duration-500 shadow-xl"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Transmit"}
                </Button>
              </form>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactUs;
