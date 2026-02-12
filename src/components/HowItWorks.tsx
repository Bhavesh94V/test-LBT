'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Search, FileText, Users, TrendingDown, Key, ChevronDown } from 'lucide-react';

// --- Brand Colors ---
const BRAND_RED = "#D92228";

// --- Data (Fixed Content) ---
const steps = [
    {
        id: 1,
        title: "Explore Properties",
        description: "Browse residential projects based on your preferred location, configuration, and budget range.",
        icon: Search,
    },
    {
        id: 2,
        title: "Register Interest",
        description: "Share your interest in a property so we can understand buyer demand and verify genuine intent.",
        icon: FileText,
    },
    {
        id: 3,
        title: "Join Group",
        description: "Verified buyers with similar requirements come together to form a focused group for the selected property.",
        icon: Users,
    },
    {
        id: 4,
        title: "Get Group Discount",
        description: "Once the group is aligned, pricing discussions are initiated to explore potential group-level benefits.",
        icon: TrendingDown,
    },
    {
        id: 5,
        title: "Individual Booking",
        description: "Each buyer proceeds independently based on comfort, terms, and final decision.",
        icon: Key,
    }
];

// --- Orbit Item Component ---
const OrbitItem = ({ step, index, currentRotation }: { step: any, index: number, currentRotation: any }) => {
    const totalSteps = steps.length;
    const angle = (360 / totalSteps) * index; // 0, 72, 144...

    // Calculate relative rotation to keep icons upright while the parent spins
    const reverseRotation = useTransform(currentRotation, value => -value);

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center"
            style={{ rotate: angle }}
        >
            <div
                className="relative flex items-center justify-center"
                style={{ transform: `translateX(280px)` }} // Radius of orbit
            >
                <motion.div
                    style={{ rotate: reverseRotation }} // Counter-rotate to keep upright
                    className="relative group cursor-pointer"
                >
                    {/* The Icon Bubble */}
                    <div className={`
                        w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 transition-all duration-500
                        bg-white border-stone-100 hover:border-[#D92228]
                    `}>
                        <step.icon size={32} className="text-stone-400 group-hover:text-[#D92228] transition-colors" />
                    </div>

                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-xs font-bold text-stone-600 border-2 border-white">
                        {index + 1}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const HowItWorks = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [activeStep, setActiveStep] = useState(0);

    // Map scroll (0 to 1) to Rotation (0 to 360 degrees)
    const rotate = useTransform(scrollYProgress, [0, 1], [0, -360 + 72]); // Stop exactly at last item
    const smoothRotate = useSpring(rotate, { stiffness: 60, damping: 20 });

    // Update active step based on scroll
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const stepIndex = Math.min(
                Math.round(latest * (steps.length - 1)),
                steps.length - 1
            );
            setActiveStep(stepIndex);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-transparent font-sans">

            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden py-4 md:py-10">

                {/* Section Header - Relative Positioning to prevent overlap */}
                <div className="relative z-30 text-center mb-0 md:mb-12 flex-shrink-0 px-4">
                    <h2 className="text-3xl md:text-5xl text-stone-900 mb-2 md:mb-3">How It Works</h2>
                    <p className="text-stone-500 font-light text-sm md:text-base">Scroll to explore the cycle</p>
                </div>

                {/* --- ORBIT SYSTEM --- */}
                {/* UPDATES FOR MOBILE:
                    1. Removed 'hidden lg:flex' so it shows on all screens.
                    2. Added 'scale-[0.55]' for mobile to shrink the 650px orbit to fit a ~360px screen.
                    3. Added 'md:scale-[0.8]' for tablets.
                    4. 'lg:scale-100' for desktops.
                */}
                <div className="relative w-[650px] h-[650px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 origin-center
                    scale-[0.55] sm:scale-[0.7] md:scale-[0.85] lg:scale-100"
                >

                    {/* Orbit Rings (Decorative) */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-stone-300 opacity-60" />
                    <div className="absolute inset-20 rounded-full border border-stone-200/50 opacity-40" />

                    {/* Rotating Container */}
                    <motion.div
                        style={{ rotate: smoothRotate }}
                        className="absolute inset-0 w-full h-full z-10"
                    >
                        {steps.map((step, index) => (
                            <OrbitItem
                                key={step.id}
                                step={step}
                                index={index}
                                currentRotation={smoothRotate}
                            />
                        ))}

                        {/* The Active Indicator (A glowing dot that follows rotation) */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-0 h-0"
                            style={{ rotate: activeStep * 72 }} // 360/5 = 72
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] pointer-events-none">
                                {/* This dot sits on the orbit path */}
                                <div className="w-3 h-3 bg-[#D92228] rounded-full absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 shadow-[0_0_20px_#D92228] animate-pulse" />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* --- THE HUB (Center Content) --- */}
                    <div className="relative z-20 w-80 h-80 bg-white/90 backdrop-blur-2xl rounded-full shadow-2xl border border-white/50 flex flex-col items-center justify-center text-center p-8">

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center"
                            >
                                {/* Active Icon Clone */}
                                <div className="w-16 h-16 bg-[#D92228]/10 rounded-full flex items-center justify-center mb-4 text-[#D92228]">
                                    {React.createElement(steps[activeStep].icon, { size: 32 })}
                                </div>

                                <h3 className="text-2xl text-stone-900 mb-3 leading-none">
                                    {steps[activeStep].title}
                                </h3>
                                <p className="text-sm text-stone-500 font-light leading-relaxed">
                                    {steps[activeStep].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Progress Indicator Ring around Hub */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <circle
                                cx="50%" cy="50%" r="48%"
                                fill="none" stroke="#e5e5e5" strokeWidth="2"
                            />
                            <motion.circle
                                cx="50%" cy="50%" r="48%"
                                fill="none" stroke="#D92228" strokeWidth="4"
                                pathLength={scrollYProgress}
                                strokeLinecap="round"
                                style={{ pathLength: scrollYProgress }}
                            />
                        </svg>
                    </div>

                </div>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0.9, 1], [1, 0]) }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400 z-30"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll to Rotate</span>
                    <ChevronDown className="animate-bounce" />
                </motion.div>

            </div>
        </section>
    );
};

export default HowItWorks;
