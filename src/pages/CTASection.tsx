'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// --- Brand Colors ---
const BRAND_RED = "#D92228";

// --- Constants ---
const MESSAGES = [
    "READY TO BUY?",
    "SAVE UP TO 30%",
    "JOIN SYNDICATE",
    "BECOME OWNER"
];

// --- Component: Single Split-Flap Character ---
const SplitFlapChar = ({ char }: { char: string }) => {
    const [previousChar, setPreviousChar] = useState(char);
    const [isFlipping, setIsFlipping] = useState(false);

    // Detect change and trigger flip
    useEffect(() => {
        if (char !== previousChar) {
            setIsFlipping(true);
            const timer = setTimeout(() => {
                setPreviousChar(char);
                setIsFlipping(false);
            }, 600); // Sync with animation duration
            return () => clearTimeout(timer);
        }
    }, [char, previousChar]);

    return (
        <div className="relative w-10 h-16 md:w-16 md:h-24 perspective-1000 mx-[1px] md:mx-1">
            {/* Structure of a Split Flap:
         1. Top Half (Static - Next Char) - Behind
         2. Bottom Half (Static - Previous Char) - Behind
         3. Top Flap (Animated) - Starts at Previous Char, Flips down
         4. Bottom Flap (Animated) - Starts hidden, Flips down to show Next Char
      */}

            {/* STATIC TOP (Next Char) */}
            <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-white border border-stone-200 rounded-t-lg z-0">
                <span className="absolute top-0 left-0 w-full h-[200%] flex items-center justify-center text-2xl md:text-5xl font-mono font-bold text-stone-900 bg-stone-50">
                    {char}
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-stone-200 z-10" />
            </div>

            {/* STATIC BOTTOM (Previous Char) */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-white border border-stone-200 rounded-b-lg z-0">
                <span className="absolute -top-[100%] left-0 w-full h-[200%] flex items-center justify-center text-2xl md:text-5xl font-mono font-bold text-stone-900 bg-stone-50">
                    {previousChar}
                </span>
            </div>

            {/* ANIMATED FLAP */}
            <AnimatePresence>
                {isFlipping && (
                    <motion.div
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: -180 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-full h-full z-10"
                        style={{ transformStyle: 'preserve-3d', transformOrigin: 'center' }}
                    >
                        {/* FRONT OF FLAP (Top Half of Previous Char) */}
                        <div
                            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-stone-50 border border-stone-200 rounded-t-lg backface-hidden"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <span className="absolute top-0 left-0 w-full h-[200%] flex items-center justify-center text-2xl md:text-5xl font-mono font-bold text-stone-900">
                                {previousChar}
                            </span>
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-stone-200/50" />
                        </div>

                        {/* BACK OF FLAP (Bottom Half of Next Char) */}
                        <div
                            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-stone-50 border border-stone-200 rounded-b-lg"
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateX(180deg) translateY(100%)', // Position it correctly on the back
                                marginTop: '-1px' // Slight overlap fix
                            }}
                        >
                            <span className="absolute -top-[100%] left-0 w-full h-[200%] flex items-center justify-center text-2xl md:text-5xl font-mono font-bold text-stone-900">
                                {char}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gloss Overlay for "Glass/Plastic" feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-lg z-20" />
        </div>
    );
};

// --- Component: The Full Board ---
const SplitFlapBoard = ({ text }: { text: string }) => {
    // Ensure we always have enough tiles. Pad with spaces.
    const maxLength = 16;
    const paddedText = text.padEnd(maxLength, " ");
    const chars = paddedText.split("");

    return (
        <div className="flex justify-center flex-wrap gap-y-2">
            {chars.map((char, index) => (
                <SplitFlapChar key={index} char={char} />
            ))}
        </div>
    );
};

const CTASection = () => {
    const navigate = useNavigate();
    const [messageIndex, setMessageIndex] = useState(0);

    // Mock Auth
    const isAuthenticated = false;

    // Cycle through messages
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 3500); // Change message every 3.5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleGetStarted = () => {
        if (isAuthenticated) navigate('/properties');
        else navigate('/signup');
    };

    return (
        <section className="relative py-32 bg-white overflow-hidden border-t border-stone-100">

            {/* Background Decor: Abstract Blueprint Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-black" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black" />
                <div className="absolute top-0 left-0 w-full h-full"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="container-section relative z-10 flex flex-col items-center text-center">

                {/* Top Label */}
                {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-xs font-mono font-bold uppercase tracking-widest text-stone-500 mb-12">
                    <Terminal size={14} /> System Status: Online
                </div> */}

                {/* --- THE SPLIT FLAP BOARD --- */}
                <div className="mb-16 scale-90 md:scale-100 origin-top">
                    <div className="p-4 bg-stone-100/50 rounded-xl border border-stone-200 inline-block shadow-inner">
                        <SplitFlapBoard text={MESSAGES[messageIndex]} />
                    </div>
                </div>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="body-large text-stone-500 mb-10 max-w-lg mx-auto leading-relaxed font-light"
                >
                    Stop paying retail premiums. <br />
                    Join the waiting list for the next bulk acquisition deal.
                </motion.p>

                {/* Main Action Button */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        onClick={handleGetStarted}
                        size="lg"
                        className="relative bg-[#D92228] hover:bg-black text-white h-16 px-12 text-lg rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 border-2 border-transparent"
                    >
                        <Sparkles className="mr-3 w-5 h-5" />
                        Get Started Now
                        <ArrowRight className="ml-3 w-5 h-5" />
                    </Button>
                </motion.div>

                {/* Trust Indicators */}
                <div className="mt-16 flex items-center justify-center gap-8 opacity-50 grayscale mix-blend-multiply">
                    {/* Placeholder Logos for Trust */}
                    {['HDFC', 'SBI', 'ICICI', 'AXIS'].map((bank) => (
                        <span key={bank} className="text-xl  font-bold text-stone-300">{bank}</span>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CTASection;
