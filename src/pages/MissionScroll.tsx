"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, TrendingUp, Users, PlayCircle, Wallet } from "lucide-react"
import { useNavigate } from "react-router-dom"

// --- ANIMATION VARIANTS (Typed correctly) ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: [0.2, 0.65, 0.3, 0.9] as const // "as const" fixes TS error
        }
    }
}

export function MissionScroll() {
    const targetRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    // 1. Scroll Progress
    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    // 2. Smooth Physics
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 })

    // 3. Horizontal Movement Logic
    // FIX: Using 'vw' units ensures exact stopping point. 
    // 0vw = Start, -200vw = Exactly showing the 3rd slide (since width is 300vw)
    const x = useTransform(smoothProgress, [0, 1], ["0vw", "-200vw"])

    // Parallax for Background Elements
    const bgParallax = useTransform(smoothProgress, [0, 1], ["0%", "20%"])

    // CTA Logic
    const handleGetStarted = () => {
        const isLoggedIn = false; // Replace with actual auth check
        if (isLoggedIn) {
            navigate('/properties');
        } else {
            // Trigger Login Popup logic here
            console.log("Open Login Popup");
            // For now, redirecting as requested
            navigate('/properties');
        }
    }

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-white font-sans selection:bg-red-50 selection:text-red-900">

            {/* Sticky Viewport */}
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-50 z-50">
                    <motion.div style={{ scaleX: smoothProgress }} className="h-full bg-red-600 origin-left" />
                </div>

                {/* Horizontal Track (300vw width for 3 slides) */}
                <motion.div style={{ x }} className="flex gap-0 h-full w-[300vw] will-change-transform">

                    {/* =========================================
              SLIDE 1: "Buying Alone Works" 
             ========================================= */}
                    <div className="relative h-screen w-screen flex-shrink-0 flex items-center justify-center bg-[#FAFAFA] overflow-hidden">

                        {/* Background Decoration */}
                        <div className="absolute inset-0 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }}
                        />
                        <motion.div style={{ x: bgParallax }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-slate-200/40 rounded-full blur-[100px] pointer-events-none" />

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-7xl"
                        >
                            <div className="order-2 md:order-1">
                                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-8">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" /> The Context
                                </motion.div>

                                <motion.h2 variants={itemVariants} className="text-6xl md:text-8xl font-semibold text-slate-300 mb-6 leading-[1] tracking-tight">
                                    Buying <br />
                                    <span className="text-slate-900 relative inline-block">
                                        alone
                                        <svg className="absolute w-full h-4 -bottom-1 left-0 text-red-500 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                                            <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    </span>
                                    {" "}works.
                                </motion.h2>

                                <motion.p variants={itemVariants} className="text-xl text-slate-500 leading-relaxed max-w-md font-medium">
                                    It's the traditional way. Retail prices, individual negotiation, and limited leverage against big developers.
                                </motion.p>
                            </div>

                            {/* Visual: Single User Card */}
                            <div className="order-1 md:order-2 flex justify-center">
                                <motion.div
                                    variants={itemVariants}
                                    className="w-80 bg-white border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-10 rotate-3 flex flex-col justify-between hover:rotate-0 transition-transform duration-700 ease-out"
                                >
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl mb-8 flex items-center justify-center text-slate-400">
                                        <Users size={32} />
                                    </div>
                                    <div className="space-y-4 mb-8">
                                        <div className="h-2 w-full bg-slate-100 rounded-full" />
                                        <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
                                    </div>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">Individual</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>


                    {/* =========================================
              SLIDE 2: "Buying Together Works Better" 
             ========================================= */}
                    <div className="relative h-screen w-screen flex-shrink-0 flex items-center justify-center bg-white overflow-hidden">

                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FFF5F5] to-white" />
                        <motion.div style={{ x: bgParallax }} className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-20 max-w-7xl"
                        >
                            <div className="md:w-1/2">
                                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-widest mb-8">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> The Revolution
                                </motion.div>

                                <motion.h2 variants={itemVariants} className="text-6xl md:text-8xl font-bold text-slate-900 mb-8 leading-[1] tracking-tight">
                                    Buying <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">together</span> <br />
                                    works better.
                                </motion.h2>

                                <motion.p variants={itemVariants} className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                                    Lets Buy helps home buyers explore residential projects together, creating better pricing conversations through structured group buying.
                                </motion.p>
                            </div>

                            <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {[
                                    { icon: Users, label: "Group Power", desc: "Negotiate as a collective force" },
                                    { icon: TrendingUp, label: "Better Pricing", desc: "Unlock exclusive wholesale rates" },
                                    { icon: CheckCircle2, label: "Verified Projects", desc: "Pre-vetted for peace of mind" },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={itemVariants}
                                        className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(220,38,38,0.1)] hover:-translate-y-1 transition-all duration-300 ${idx === 2 ? 'sm:col-span-2' : ''}`}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-5">
                                            <item.icon size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{item.label}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>


                    {/* =========================================
              SLIDE 3: "Join the Movement" (Action) 
             ========================================= */}
                    <div className="relative h-screen w-screen flex-shrink-0 flex items-center justify-center bg-[#FFFFFF] overflow-hidden">

                        {/* Subtle Texture */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #E2E8F0 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            className="container mx-auto px-6 relative z-10 max-w-6xl"
                        >
                            <div className="flex flex-col items-center text-center mb-16">
                                <motion.h2 variants={itemVariants} className="text-5xl md:text-8xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                                    Join the <span className="text-red-600 relative inline-block">
                                        Movement.
                                        <svg className="absolute w-full h-4 -bottom-1 left-0 text-red-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
                                    </span>
                                </motion.h2>
                                <motion.p variants={itemVariants} className="text-slate-500 max-w-xl text-lg font-medium leading-relaxed">
                                    Be part of India's first structured group buying platform and start your home buying journey smarter.
                                </motion.p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 w-full">
                                {[
                                    { val: "50+", label: "Active Properties", icon: CheckCircle2 },
                                    { val: "500+", label: "Happy Buyers", icon: Users },
                                    { val: "₹15Cr+", label: "Total Savings", icon: Wallet },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        className="group p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 text-center flex flex-col items-center justify-center h-full"
                                    >
                                        <div className="inline-flex p-4 bg-slate-50 rounded-2xl mb-6 group-hover:bg-red-50 transition-colors">
                                            <stat.icon className="w-6 h-6 text-slate-400 group-hover:text-red-500 transition-colors" />
                                        </div>
                                        <div className="text-5xl font-bold text-slate-900 mb-2 tracking-tighter">
                                            {stat.val}
                                        </div>
                                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    size="lg"
                                    onClick={handleGetStarted}
                                    className="h-16 px-10 text-lg rounded-full bg-slate-900 text-white hover:bg-red-600 transition-all shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_30px_-5px_rgba(220,38,38,0.3)] font-semibold group"
                                >
                                    Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => navigate('/how-it-works')}
                                    className="h-16 px-10 text-lg rounded-full border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all font-semibold"
                                >
                                    <PlayCircle className="mr-2 w-5 h-5" /> How It Works?
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>

                </motion.div>
            </div>
        </section>
    )
}
