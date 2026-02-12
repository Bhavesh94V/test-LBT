'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, MapPin, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { properties } from '@/data/properties';

// --- Types & Variants (Fixed Red Errors) ---

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
};

// --- 3D Background Animation (Transparent BG) ---
const BlueprintTerrain = () => {
    const { scrollYProgress } = useScroll();

    // Parallax effects
    const rotateX = useTransform(scrollYProgress, [0, 1], [45, 60]);
    const translateY = useTransform(scrollYProgress, [0, 1], [0, -200]);

    return (
        <div className="absolute inset-0 overflow-hidden -z-10 bg-transparent">
            {/* Perspective Container */}
            <div className="absolute w-full h-[150%] -top-[25%] flex items-center justify-center perspective-[1000px] overflow-hidden">
                <motion.div
                    style={{
                        rotateX: rotateX,
                        translateY: translateY,
                        width: '200vw',
                        height: '200vh',
                    }}
                    className="relative bg-transparent"
                >
                    {/* The Grid Mesh */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '60px 60px',
                            maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)'
                        }}
                    />

                    {/* Floating "Blocks" representing buildings rising */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                z: [0, 60, 0],
                                opacity: [0, 0.4, 0],
                            }}
                            transition={{
                                duration: 5 + Math.random() * 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: Math.random() * 5
                            }}
                            className="absolute border border-stone-400/30 bg-stone-300/20 backdrop-blur-[1px]"
                            style={{
                                width: Math.random() * 100 + 50,
                                height: Math.random() * 100 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                transform: 'translateZ(0px)', // Base position
                            }}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Fog Overlay for Depth - Transparent base */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent pointer-events-none" />
        </div>
    );
};

const safePriceRange = (pr: any): string => {
    if (!pr) return '';
    if (typeof pr === 'string') return pr;
    if (typeof pr === 'object' && pr !== null) {
        const min = pr.min ?? pr.minimum ?? 0;
        const max = pr.max ?? pr.maximum ?? 0;
        const fmt = (v: number) => v >= 10000000 ? `${(v / 10000000).toFixed(1)} Cr` : v >= 100000 ? `${(v / 100000).toFixed(0)} Lacs` : `${v}`;
        return max ? `₹${fmt(min)} - ₹${fmt(max)}` : `₹${fmt(min)}+`;
    }
    return String(pr);
};

const safeSavings = (s: any): string => {
    if (!s) return '';
    if (typeof s === 'string') return s;
    if (typeof s === 'object' && s !== null) {
        const min = s.min ?? 0;
        const max = s.max ?? 0;
        const fmt = (v: number) => v >= 100000 ? `${(v / 100000).toFixed(0)} Lacs` : `${v}`;
        return max ? `₹${fmt(min)} - ₹${fmt(max)}` : `₹${fmt(min)}`;
    }
    return String(s);
};

const FeaturedProperties = () => {
    const navigate = useNavigate();
    const bentoItems = properties.slice(0, 8);

    const getBentoClass = (index: number) => {
        switch (index) {
            case 0: return "md:col-span-2 md:row-span-2 min-h-[500px]";
            case 1: return "md:col-span-1 md:row-span-2 min-h-[500px]";
            default: return "md:col-span-1 md:row-span-1 min-h-[320px]";
        }
    };

    return (
        <section className="relative py-24 overflow-hidden bg-transparent">

            {/* Added 3D Background */}
            <BlueprintTerrain />

            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <div className="inline-block rounded-xl backdrop-blur-sm p-4 bg-white/30 border border-white/40 shadow-sm">
                        <h2 className="heading-section text-foreground mb-4 text-4xl md:text-5xl text-stone-900">Featured Properties</h2>
                        <p className="body-base text-stone-600 max-w-2xl mx-auto text-lg font-light">
                            Explore homes where buyers with similar requirements are coming together for group buying opportunities.
                        </p>
                    </div>
                </motion.div>

                {/* Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {bentoItems.map((property, index) => (
                        <motion.div
                            key={property.id}
                            variants={fadeInUp}
                            className={`group relative rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-white/60 bg-white ${getBentoClass(index)}`}
                        >
                            {/* Image */}
                            <div className="absolute inset-0 w-full h-full bg-stone-900">
                                <img
                                    src={property.image || "/placeholder.svg"}
                                    alt={property.name}
                                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105 opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-5 left-5 z-20 flex gap-2">
                                <div className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
                                    {property.status.replace('-', ' ')}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full pointer-events-none">
                                <div className="mt-auto pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="mb-4">
                                        <h3 className={`text-white leading-tight mb-2 drop-shadow-md ${index === 0 ? 'text-3xl' : 'text-2xl'}`}>
                                            {property.name}
                                        </h3>
                                        <div className="flex items-center text-white/90 text-sm font-medium tracking-wide">
                                            <MapPin size={14} className="mr-1.5 text-[#D92228]" />
                                            {property.location}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                                        <div>
                                            <div className="flex items-center gap-2 text-[#ff9e9e] text-xs font-bold uppercase tracking-wider mb-1">
                                                <TrendingDown size={14} /> Save {safeSavings(property.estimatedSavings)}
                                            </div>
                                            <div className="text-base text-white font-semibold tracking-tight">{safePriceRange(property.priceRange)}</div>
                                        </div>
                                        <Button
                                            onClick={() => navigate(`/properties/${property.id}`)}
                                            size="icon"
                                            className="rounded-full w-10 h-10 bg-white text-stone-900 hover:bg-[#D92228] hover:text-white border-0 transition-colors duration-300 shadow-lg"
                                        >
                                            <ArrowRight size={18} />
                                        </Button>
                                    </div>

                                    {index === 0 && (
                                        <div className="mt-5 pt-4 border-t border-white/10">
                                            <div className="flex justify-between text-xs text-white/80 mb-2 font-medium">
                                                <span><strong className="text-white">{property.buyersJoined}</strong> Joined</span>
                                                <span><strong className="text-white">{property.totalPositions}</strong> Slots</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#D92228] rounded-full shadow-[0_0_10px_#D92228]"
                                                    style={{ width: `${(property.buyersJoined / property.totalPositions) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer Button */}
                <motion.div {...fadeInUp} className="text-center mt-16">
                    <Button
                        onClick={() => navigate('/properties')}
                        variant="outline"
                        size="lg"
                        className="h-14 px-10 text-lg font-medium rounded-sm text-stone-600 border-stone-300 hover:bg-stone-100 hover:text-stone-900 transition-all bg-white/80 backdrop-blur-md shadow-sm"
                    >
                        View All Properties
                        <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                </motion.div>

            </div>
        </section>
    );
};

export default FeaturedProperties;
