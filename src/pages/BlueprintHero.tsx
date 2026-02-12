import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users, Wallet, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types & Variants ---

const slowRise: Variants = {
    hidden: { opacity: 0, y: 50, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
    }
};

const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
};

const technicalLine: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
        scaleX: 1,
        opacity: 1,
        transition: { duration: 1.5, ease: "easeInOut" }
    }
};

// --- BRAND CONSTANTS ---
// The specific red from the "LB" logo and "Get Started" button
const BRAND_RED = "#D92228";

// --- 3D COMPONENTS (Refined & Lightened) ---

const BlueprintGrid = () => (
    <div className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
            transform: 'translateZ(-100px)',
        }}
    >
        {/* Main Floor Grid - Lighter and subtle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2000px] h-[2000px]"
            style={{
                backgroundImage: `
                     linear-gradient(rgba(168, 162, 158, 0.3) 1px, transparent 1px), 
                     linear-gradient(90deg, rgba(168, 162, 158, 0.3) 1px, transparent 1px)
                 `,
                backgroundSize: '100px 100px',
                maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)'
            }}
        />
        {/* Secondary finer grid */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2000px] h-[2000px]"
            style={{
                backgroundImage: `
                     linear-gradient(rgba(168, 162, 158, 0.1) 1px, transparent 1px), 
                     linear-gradient(90deg, rgba(168, 162, 158, 0.1) 1px, transparent 1px)
                 `,
                backgroundSize: '20px 20px',
                maskImage: 'radial-gradient(circle at center, black 0%, transparent 50%)'
            }}
        />
    </div>
);

// 1. Core Shaft - Lighter, Glassy feel with Red Tint
const CoreShaft = () => (
    <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 2, ease: "circOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-[800px] bg-stone-200/40 backdrop-blur-[2px]"
        style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(-40px)',
            borderLeft: `1px solid ${BRAND_RED}40`, // 40 = low opacity hex
            borderRight: `1px solid ${BRAND_RED}40`,
        }}
    >
        {/* Front Face Details */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100%_100px]" />

        {/* Side Panels - Lighter Stone Color */}
        <div className="absolute top-0 right-0 h-full w-[40px] bg-stone-300/30 origin-right transform-gpu border-r border-stone-400/50"
            style={{ transform: 'rotateY(90deg)' }} />
        <div className="absolute top-0 left-0 h-full w-[40px] bg-stone-300/30 origin-left transform-gpu border-l border-stone-400/50"
            style={{ transform: 'rotateY(-90deg)' }} />
    </motion.div>
);

// 2. Structural Pillars - Lighter Stone Gray
const Pillar = ({ x, z, delay }: { x: number, z: number, delay: number }) => (
    <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: delay, ease: "circOut" }}
        className="absolute bottom-0 w-8 h-[700px] bg-stone-400/20 border-x border-stone-400/60 origin-bottom"
        style={{
            transform: `translateX(${x}px) translateZ(${z}px)`,
        }}
    >
        {/* Subtle red accent line inside pillar */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-red-500/20" />
    </motion.div>
);

// 3. Floor Slabs - Lighter Borders, Clearer Glass
const FloorPlate = ({ y, delay, rotateOffset }: { y: number, delay: number, rotateOffset: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 1.5, rotateY: rotateOffset }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.2, delay: delay, ease: "backOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-stone-100/80 shadow-sm"
        style={{
            transform: `translateY(${-y}px) rotateX(90deg)`,
            border: `1px solid ${BRAND_RED}50`, // 50% opacity red border
        }}
    >
        {/* Grid Pattern on Floor */}
        <div className="w-full h-full bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:35px_35px]" />

        {/* Corner Accents - Small Red Dots */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5" style={{ backgroundColor: BRAND_RED }} />
        <div className="absolute top-0 right-0 w-1.5 h-1.5" style={{ backgroundColor: BRAND_RED }} />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5" style={{ backgroundColor: BRAND_RED }} />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5" style={{ backgroundColor: BRAND_RED }} />
    </motion.div>
);

const ConstructionZone = () => {
    const { scrollY } = useScroll();

    // Auto-rotation 
    const [rotation, setRotation] = useState(0);
    useEffect(() => {
        let animationFrameId: number;
        const animate = () => {
            setRotation(prev => (prev + 0.15) % 360);
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const y = useTransform(scrollY, [0, 1000], [0, 200]);
    const floorHeights = [100, 200, 300, 400, 500];

    return (
        <div className="absolute inset-0 overflow-hidden -z-10">
            {/* Perspective Container */}
            <div className="absolute w-full h-full flex items-center justify-center perspective-[1200px]">

                <motion.div
                    style={{
                        rotateY: rotation,
                        rotateX: 75,
                        translateY: y,
                        transformStyle: "preserve-3d"
                    }}
                    className="relative w-0 h-0"
                >
                    <BlueprintGrid />

                    {/* Central Core */}
                    <CoreShaft />

                    {/* Outer Pillars - Spread out */}
                    <Pillar x={-220} z={-220} delay={0.2} />
                    <Pillar x={220} z={-220} delay={0.4} />
                    <Pillar x={-220} z={220} delay={0.6} />
                    <Pillar x={220} z={220} delay={0.8} />

                    {/* Floors */}
                    {floorHeights.map((h, i) => (
                        <FloorPlate
                            key={i}
                            y={h}
                            delay={1 + (i * 0.2)}
                            rotateOffset={i % 2 === 0 ? 90 : -90}
                        />
                    ))}

                    {/* Floating Debris - Subtle and Light */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -600],
                                opacity: [0, 0.6, 0],
                                rotate: [0, 180]
                            }}
                            transition={{
                                duration: 6 + i,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute w-2 h-2 border border-stone-400 bg-transparent"
                            style={{
                                transform: `translateX(${Math.random() * 600 - 300}px) translateZ(${Math.random() * 600 - 300}px)`
                            }}
                        />
                    ))}

                </motion.div>
            </div>

            {/* Soft gradient at bottom */}
            <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
    );
};

// --- UI Components ---

const StatItem = ({ icon: Icon, value, label, delay }: { icon: any, value: string, label: string, delay: number }) => (
    <div className="group relative pl-8 py-3">
        {/* Vertical Line - Brand Red */}
        <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1, delay: delay, ease: "circOut" }}
            className="absolute left-0 top-0 w-[2px] rounded-full bg-stone-300 group-hover:bg-[#D92228] transition-colors duration-500"
        />

        <div className="flex flex-col items-start gap-1">
            <div className="text-[#D92228] mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <Icon size={24} strokeWidth={1.5} />
            </div>
            <span className="text-3xl font-medium text-stone-900 tracking-tight font-sans">
                {value}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">
                {label}
            </span>
        </div>
    </div>
);

const HeroSection = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/properties');
    };

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden font-sans text-stone-900">

            <ConstructionZone />

            <div className="container mx-auto px-6 relative z-10 pt-16 lg:pt-0">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-6xl mx-auto"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">

                        {/* Text Content */}
                        <div className="lg:col-span-8">
                            <motion.div variants={slowRise} className="mb-8">
                                <span
                                    className="inline-block py-1 px-4 border rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest backdrop-blur-md bg-[#D92228]/5 border-[#D92228]/20 text-[#D92228]"
                                >
                                    India's First Group Buying Platform
                                </span>
                            </motion.div>

                            <motion.h1 variants={slowRise} className="text-6xl md:text-8xl font-normal text-stone-900 leading-[0.95] tracking-tight mb-10">
                                Buying alone <br /> works. <br />
                                <span className="text-stone-400 block mt-2">
                                    Buying <span className="relative inline-block text-[#D92228]">
                                        together
                                        <span className="absolute left-0 bottom-1 w-full h-[3px] bg-[#D92228]/20"></span>
                                    </span> works better.
                                </span>
                            </motion.h1>

                            <div className="flex flex-col md:flex-row gap-5 mt-12">
                                <motion.div variants={slowRise}>
                                    <Button
                                        onClick={handleGetStarted}
                                        className="h-14 px-10 text-lg font-medium rounded-sm text-white hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-red-900/10 border-0"
                                        style={{ backgroundColor: BRAND_RED }}
                                    >
                                        Get Started <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </motion.div>
                                <motion.div variants={slowRise}>
                                    <Button
                                        onClick={() => navigate('/how-it-works')}
                                        variant="outline"
                                        className="h-14 px-10 text-lg font-medium rounded-sm text-stone-600 border-stone-300 hover:bg-stone-100/50 hover:text-stone-900 transition-all duration-300 bg-transparent"
                                    >
                                        <PlayCircle className="mr-2 w-5 h-5 text-stone-400" /> How It Works?
                                    </Button>
                                </motion.div>
                            </div>
                        </div>

                        {/* Stats Column */}
                        <div className="lg:col-span-4 flex flex-col justify-end pb-4">
                            <motion.p variants={slowRise} className="text-lg text-stone-600 font-light leading-relaxed mb-12 pl-1">
                                Lets Buy helps home buyers explore residential projects together, creating better pricing conversations through structured group buying.
                            </motion.p>

                            <motion.div variants={technicalLine} className="w-full h-[1px] bg-stone-300 mb-8 origin-left" />

                            <motion.div variants={slowRise} className="grid grid-cols-1 gap-8">
                                <StatItem
                                    icon={Building2}
                                    value="50+"
                                    label="Active Properties"
                                    delay={0.8}
                                />
                                <StatItem
                                    icon={Users}
                                    value="500+"
                                    label="Happy Buyers"
                                    delay={1.0}
                                />
                                <StatItem
                                    icon={Wallet}
                                    value="₹15 Cr+"
                                    label="Total Savings"
                                    delay={1.2}
                                />
                            </motion.div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
