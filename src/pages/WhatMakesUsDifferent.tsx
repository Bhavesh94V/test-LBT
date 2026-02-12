'use client'

import React, { useRef, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import {
    ShieldCheck,
    UserCheck,
    Handshake,
    BrainCircuit,
    ArrowUpRight
} from 'lucide-react'

// --- Brand Color ---
const BRAND_RED = '#D92228'

// --- Animation Variants ---
const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
    }
}

const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Delay between each card appearing
            delayChildren: 0.1
        }
    }
}

const cardEntranceVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
}

// --- Features Data ---
const features = [
    {
        id: '01',
        title: 'No Brokerage for Buyers',
        subtitle: 'Zero Commission',
        description:
            'We don’t charge traditional broker commissions. Our model removes unnecessary middlemen, ensuring buyers get direct price advantages without any hidden costs.',
        icon: ShieldCheck
    },
    {
        id: '02',
        title: 'Verified Buyer Commitment',
        subtitle: 'Serious Buyers Only',
        description:
            'Every participant is intent-verified before any price discussion begins. This ensures developers negotiate only with genuine, ready-to-buy groups.',
        icon: UserCheck
    },
    {
        id: '03',
        title: 'Fair & Transparent Process',
        subtitle: 'Clarity at Every Step',
        description:
            'No closed-door negotiations or selective pricing. Terms are discussed openly and only when the group is fully prepared, creating trust and fairness for all.',
        icon: Handshake
    },
    {
        id: '04',
        title: 'Buyer-First Philosophy',
        subtitle: 'You Stay in Control',
        description:
            'We create collective leverage, but the final decision is always yours. You purchase independently, empowered by the strength of a verified group.',
        icon: BrainCircuit
    }
]

// --- Ripple Card ---
const RippleCard = ({ feature }: { feature: any }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [hovered, setHovered] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    return (
        <motion.div
            variants={cardEntranceVariants} // Attach animation variant here
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={handleMouseMove}
            className='relative w-full min-h-[320px] lg:h-[420px]
      border-b md:border-r md:even:border-r-0
      border-slate-200 bg-white overflow-hidden group'
        >
            {/* Ripple Effect (Existing Animation) */}
            <motion.div
                animate={{
                    x: hovered ? mousePos.x - 250 : mousePos.x,
                    y: hovered ? mousePos.y - 250 : mousePos.y,
                    scale: hovered ? 2 : 0,
                    opacity: hovered ? 1 : 0
                }}
                transition={{ duration: 0.5, ease: 'circOut' }}
                className='absolute top-0 left-0 w-[500px] h-[500px] md:w-[650px] md:h-[650px]
        rounded-full pointer-events-none z-0'
                style={{ backgroundColor: BRAND_RED }}
            />

            {/* Content */}
            <div className='relative z-10 h-full p-6 md:p-8 lg:p-10 flex flex-col justify-between'>
                {/* Top */}
                <div className='flex justify-between items-start'>
                    <div
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-colors duration-500 ${hovered
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-900'
                            }`}
                    >
                        <feature.icon size={22} />
                    </div>

                    <span
                        className={`text-3xl md:text-4xl font-bold transition-colors duration-500 ${hovered ? 'text-white/20' : 'text-slate-100'
                            }`}
                    >
                        {feature.id}
                    </span>
                </div>

                {/* Bottom */}
                <div className='mt-6'>
                    <span
                        className={`text-xs font-bold uppercase tracking-widest block mb-2 transition-colors duration-500 ${hovered ? 'text-white/80' : 'text-[#D92228]'
                            }`}
                    >
                        {feature.subtitle}
                    </span>

                    <h3
                        className={`text-xl md:text-2xl lg:text-3xl font-bold leading-snug transition-colors duration-500 ${hovered ? 'text-white' : 'text-slate-900'
                            }`}
                    >
                        {feature.title}
                    </h3>

                    <p
                        className={`mt-4 text-sm md:text-base leading-relaxed transition-colors duration-500 ${hovered ? 'text-white/90' : 'text-slate-500'
                            }`}
                    >
                        {feature.description}
                    </p>

                    <div
                        className={`mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-500 ${hovered ? 'text-white translate-x-2' : 'text-slate-400'
                            }`}
                    >
                        <span>Learn More</span>
                        <ArrowUpRight size={14} />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// --- Section ---
const WhatMakesUsDifferent = () => {
    return (
        <section className='bg-white relative overflow-hidden'>
            <div className='container-section py-20 md:py-24 lg:py-32'>

                {/* Header - Fades Up on Scroll */}
                <motion.div
                    className='max-w-4xl mx-auto text-center mb-20'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }} // Triggers when 30% visible
                    variants={fadeUpVariants}
                >
                    <span className='text-[#D92228] font-bold text-sm uppercase tracking-[0.2em] mb-4 block'>
                        What Makes Us Different
                    </span>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 font-['Poppins'] mb-6">
                        The <span className='text-[#D92228]'>Buying</span> Advantage
                    </h2>

                    <p className="text-slate-500 text-base md:text-lg font-['Inter'] max-w-2xl mx-auto">
                        We reimagined real estate buying by removing brokers, verifying
                        intent, and negotiating collectively—giving individual buyers
                        institutional-level leverage.
                    </p>
                </motion.div>

                {/* Grid - Staggered Card Entrance */}
                <motion.div
                    className='grid grid-cols-1 md:grid-cols-2 border-t border-l border-slate-200 shadow-xl'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={staggerContainerVariants}
                >
                    {features.map((feature, idx) => (
                        <RippleCard key={idx} feature={feature} />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default WhatMakesUsDifferent
