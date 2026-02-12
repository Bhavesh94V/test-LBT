'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const BRAND_RED = "#D92228";

const EMICalculator = () => {
    const [loanAmount, setLoanAmount] = useState(5000000); // 50 Lakhs
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);

    // Calculations
    const calculateEMI = () => {
        const principal = loanAmount;
        const ratePerMonth = interestRate / 12 / 100;
        const months = tenure * 12;
        const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) /
            (Math.pow(1 + ratePerMonth, months) - 1);
        return Math.round(emi);
    };

    const emi = calculateEMI();
    const totalAmount = emi * tenure * 12;
    const totalInterest = totalAmount - loanAmount;

    // Graph Percentages (for visual stacking)
    const principalPercent = (loanAmount / totalAmount) * 100;
    const interestPercent = (totalInterest / totalAmount) * 100;

    return (
        <section className="py-24 bg-white relative overflow-hidden">

            {/* Background Decor - Subtle Grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="container mx-auto px-6 relative z-10">

                {/* Header Content (Preserved) */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-12 h-12 rounded-xl bg-[#D92228] flex items-center justify-center mb-6 shadow-lg shadow-red-100">
                        <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-4xl text-stone-900 mb-4">EMI Calculator</h2>
                    <p className="text-stone-500 max-w-xl">
                        Plan your home purchase with our easy-to-use EMI calculator. Get an estimate of your monthly payments.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* LEFT: CONTROLS */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5 space-y-10 bg-stone-50 p-8 rounded-[2rem] border border-stone-100"
                    >
                        {/* Loan Amount Input */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-stone-500">Loan Amount</label>
                                <span className="text-lg font-bold text-stone-900">
                                    ₹{(loanAmount / 100000).toFixed(1)} Lacs
                                </span>
                            </div>
                            <Slider
                                value={[loanAmount]}
                                onValueChange={([value]) => setLoanAmount(value)}
                                min={1000000}
                                max={50000000}
                                step={100000}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-2 text-xs text-stone-400 font-mono">
                                <span>₹10L</span>
                                <span>₹5Cr</span>
                            </div>
                        </div>

                        {/* Interest Rate Input */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-stone-500">Interest Rate (p.a.)</label>
                                <span className="text-lg font-bold text-[#D92228]">{interestRate}%</span>
                            </div>
                            <Slider
                                value={[interestRate]}
                                onValueChange={([value]) => setInterestRate(value)}
                                min={6}
                                max={15}
                                step={0.1}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-2 text-xs text-stone-400 font-mono">
                                <span>6%</span>
                                <span>15%</span>
                            </div>
                        </div>

                        {/* Tenure Input */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-stone-500">Loan Tenure</label>
                                <span className="text-lg font-bold text-stone-900">{tenure} Years</span>
                            </div>
                            <Slider
                                value={[tenure]}
                                onValueChange={([value]) => setTenure(value)}
                                min={5}
                                max={30}
                                step={1}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-2 text-xs text-stone-400 font-mono">
                                <span>5 Yr</span>
                                <span>30 Yr</span>
                            </div>
                        </div>

                        <Button className="w-full h-14 text-lg bg-stone-900 hover:bg-[#D92228] text-white rounded-xl transition-all duration-300 shadow-xl">
                            Apply for Home Loan
                        </Button>
                    </motion.div>


                    {/* RIGHT: INTERACTIVE STACKED GRAPH */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 h-full min-h-[500px] bg-white rounded-[2rem] border border-stone-200 shadow-2xl p-8 relative overflow-hidden flex flex-col"
                    >
                        {/* EMI Highlight */}
                        <div className="text-center z-20 mb-8">
                            <p className="text-sm text-stone-400 font-medium uppercase tracking-widest mb-2">Your Monthly EMI</p>
                            <div className="inline-block relative">
                                <span className="text-6xl md:text-7xl font-bold text-stone-900 tracking-tighter">
                                    ₹{emi.toLocaleString('en-IN')}
                                </span>
                                {/* Decorative underline */}
                                <motion.div
                                    layout
                                    className="h-2 w-full bg-[#D92228] rounded-full mt-2 opacity-20"
                                />
                            </div>
                        </div>

                        {/* THE GRAPH CONTAINER */}
                        <div className="flex-grow flex items-end justify-center gap-4 px-4 md:px-12 relative z-20">

                            {/* Visual Stack Bar */}
                            <div className="w-24 md:w-32 h-[300px] flex flex-col-reverse rounded-2xl overflow-hidden shadow-inner bg-stone-100 relative">

                                {/* Tooltip Line */}
                                <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-stone-300" />

                                {/* Principal Block (Bottom) */}
                                <motion.div
                                    className="w-full bg-stone-800 relative group"
                                    initial={{ height: "50%" }}
                                    animate={{ height: `${principalPercent}%` }}
                                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                >
                                    <div className="absolute inset-0 bg-white/5" />
                                    {/* Inner Label */}
                                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/50 font-mono uppercase rotate-90 origin-left translate-y-4">Principal</span>
                                </motion.div>

                                {/* Interest Block (Top) */}
                                <motion.div
                                    className="w-full bg-[#D92228] relative group"
                                    initial={{ height: "50%" }}
                                    animate={{ height: `${interestPercent}%` }}
                                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                                    {/* Inner Label */}
                                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-white/80 font-mono uppercase rotate-90 origin-left">Interest</span>
                                </motion.div>
                            </div>

                            {/* Legend / Details Panel (Floating next to graph) */}
                            <div className="flex flex-col gap-6 ml-4 md:ml-8 mb-4">

                                {/* Interest Legend */}
                                <motion.div
                                    animate={{ y: interestPercent > 50 ? -20 : 0 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="text-right">
                                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Total Interest</p>
                                        <p className="text-xl font-bold text-[#D92228]">₹{totalInterest.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="w-3 h-3 rounded-full bg-[#D92228] shadow-[0_0_10px_#D92228]" />
                                </motion.div>

                                {/* Principal Legend */}
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Principal Amount</p>
                                        <p className="text-xl font-bold text-stone-800">₹{loanAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="w-3 h-3 rounded-full bg-stone-800" />
                                </div>

                                {/* Divider */}
                                <div className="h-[1px] w-full bg-stone-100 my-1" />

                                {/* Total Amount */}
                                <div className="flex items-center gap-4 opacity-50">
                                    <div className="text-right">
                                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Total Amount</p>
                                        <p className="text-lg text-stone-900">₹{totalAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="w-3 h-3 rounded-full border border-stone-300" />
                                </div>

                            </div>
                        </div>

                        {/* Background Graph Grid (Visual noise) */}
                        <div className="absolute bottom-0 left-0 right-0 h-full w-full pointer-events-none z-0 flex items-end justify-between opacity-10 px-8 pb-8">
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-[1px] bg-stone-900"
                                    initial={{ height: 10 }}
                                    animate={{ height: Math.random() * 200 + 50 }}
                                    transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: i * 0.2 }}
                                />
                            ))}
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default EMICalculator;
