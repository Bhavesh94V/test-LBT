'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowUpRight, CornerDownRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// --- Brand Colors ---
const BRAND_RED = "#D92228";

// --- FAQ Data with Images ---
const faqs = [
    {
        id: "01",
        question: "What is group buying?",
        answer: "Group buying aggregates individual demand to create wholesale purchasing power. By uniting multiple buyers, we force the market to unlock bulk-rate discounts usually reserved for institutional investors.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" // Corporate/Building
    },
    {
        id: "02",
        question: "Is my token refundable?",
        answer: "100% Refundable. Your capital is protected. If the group target isn't met or you withdraw before the final booking deed, the entire token amount is returned without deduction.",
        image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=2070&auto=format&fit=crop" // Abstract/Safe
    },
    {
        id: "03",
        question: "How much can I save?",
        answer: "Expect 15-30% below market value. The discount is mathematically derived from the project stage, inventory volume, and group size. We aim for the 'Pre-Launch' price point even in post-launch projects.",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560eb3e?q=80&w=2000&auto=format&fit=crop" // Growth/Finance
    },
    {
        id: "04",
        question: "Do you help with loans?",
        answer: "Yes. We operate a dedicated financial desk with tie-ups across major banks. We handle eligibility, documentation, and negotiate lower interest rates based on the group's collective credit profile.",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2072&auto=format&fit=crop" // Documents/signing
    },
    {
        id: "05",
        question: "What happens next?",
        answer: "Join the waitlist. Track the 'Fill Rate'. Once the group hits 100%, we execute the 'Bulk Deal' with the developer. You are then guided through a seamless digital onboarding and allocation process.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" // Hallway/Path
    }
];

const VoronoiCell = ({
    faq,
    index,
    activeId,
    setActiveId
}: {
    faq: typeof faqs[0],
    index: number,
    activeId: string | null,
    setActiveId: (id: string | null) => void
}) => {
    const isActive = activeId === faq.id;

    return (
        <motion.div
            layout
            onClick={() => setActiveId(isActive ? null : faq.id)}
            className={`
        relative overflow-hidden cursor-pointer transition-colors duration-500
        border-r border-b border-gray-200
        ${isActive ? 'bg-white z-20 shadow-2xl' : 'bg-white hover:bg-gray-50 z-0'}
      `}
            style={{
                flexGrow: isActive ? 4 : 1,
                flexBasis: isActive ? '40%' : '15%',
                minHeight: '450px' // Increased height to accommodate image nicely
            }}
        >
            {/* 1. Background Image (Only visible when Active) */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-0 left-0 w-full h-[50%] z-0 overflow-hidden"
                    >
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 10, ease: "linear" }} // Subtle zoom effect
                            src={faq.image}
                            alt="Visual"
                            className="w-full h-full object-cover opacity-90"
                        />
                        {/* Gradient Overlay to blend image into white body */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Content Container */}
            <div className="relative h-full p-6 md:p-8 flex flex-col justify-between z-10">

                {/* Top: Header / ID */}
                <div className="flex justify-between items-start">
                    <span className={`
             text-xs font-mono font-bold tracking-widest py-1 px-2 rounded-sm backdrop-blur-md
             ${isActive ? 'bg-white/80 text-[#D92228]' : 'bg-gray-100 text-gray-400'}
           `}>
                        /{faq.id}
                    </span>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`
               w-10 h-10 flex items-center justify-center border rounded-full transition-all duration-300
               ${isActive
                                ? 'bg-[#D92228] border-[#D92228] text-white rotate-45 shadow-lg'
                                : 'bg-white border-gray-200 text-gray-400 group-hover:border-black group-hover:text-black'}
             `}
                    >
                        <ArrowUpRight size={16} />
                    </motion.button>
                </div>

                {/* Middle/Bottom: Question & Answer */}
                <div className={`mt-auto transition-all duration-500 ${isActive ? 'translate-y-0' : 'translate-y-0'}`}>

                    {/* Question */}
                    <motion.h3
                        layout="position"
                        className={`
             leading-tight transition-all duration-300
                ${isActive ? 'text-3xl md:text-4xl text-black mb-6 mt-32' : 'text-2xl text-gray-800'}
              `}
                    >
                        {faq.question}
                    </motion.h3>

                    {/* Expanded Content */}
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: 10, height: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                >
                                    <div className="w-12 h-[2px] bg-[#D92228] mb-6" />

                                    <p className="text-gray-600 font-light leading-relaxed text-lg max-w-lg">
                                        {faq.answer}
                                    </p>

                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D92228] cursor-pointer hover:underline"
                                    >
                                        <CornerDownRight size={14} /> Read Documentation
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            {/* Active Border Highlight (Internal) */}
            {isActive && (
                <motion.div
                    layoutId="active-border"
                    className="absolute inset-0 border-[1px] border-black/10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}

        </motion.div>
    );
};

const FAQSection = () => {
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState<string | null>("01");

    return (
        <section className="bg-white py-32 border-t border-gray-100 relative overflow-hidden">

            {/* Background Grid Pattern (Subtle) */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }}
            />

            <div className="container mx-auto px-4 md:px-8 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 bg-[#D92228]" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">
                                The Knowledge Base
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl text-black tracking-tight">
                            Process<br />Deconstructed.
                        </h2>
                    </div>

                    <div className="max-w-xs text-right md:text-left">
                        <p className="text-sm font-mono text-gray-500 leading-relaxed border-l-2 border-[#D92228] pl-4">
                            Navigate the matrix.<br />
                            Click any panel to expand detailed insights.
                        </p>
                    </div>
                </div>

                {/* --- THE VORONOI GRID --- */}
                <div className="border-t border-l border-gray-200 bg-white shadow-sm">
                    {/* Desktop: Horizontal Flex Expansion */}
                    <div className="hidden lg:flex flex-row w-full">
                        {faqs.map((faq, index) => (
                            <VoronoiCell
                                key={faq.id}
                                faq={faq}
                                index={index}
                                activeId={activeId}
                                setActiveId={setActiveId}
                            />
                        ))}
                    </div>

                    {/* Mobile: Vertical Flex Expansion */}
                    <div className="flex lg:hidden flex-col w-full">
                        {faqs.map((faq, index) => (
                            <VoronoiCell
                                key={faq.id}
                                faq={faq}
                                index={index}
                                activeId={activeId}
                                setActiveId={setActiveId}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 flex justify-between items-center border-t border-black pt-6">
                    <div className="flex items-center gap-2">
                        <Layers size={14} className="text-[#D92228]" />
                        <span className="text-xs font-mono text-gray-500">See More FAQ's ----</span>
                    </div>

                    <Button
                        onClick={() => navigate('/faqs')}
                        variant="ghost"
                        className="text-black hover:bg-black hover:text-white rounded-none uppercase text-xs font-bold tracking-widest transition-all duration-300 h-12 px-8 border border-transparent hover:border-black"
                    >
                        Full Archive <Plus className="ml-2 w-4 h-4" />
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default FAQSection;
