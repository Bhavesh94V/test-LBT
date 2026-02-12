import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// --- Data ---
const blogPosts = [
    {
        id: '01',
        title: 'How Group Buying is Changing Real Estate in India',
        excerpt: 'Discover how collective purchasing power is helping homebuyers save lakhs on their dream homes.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
        date: 'Jan 15, 2026',
    },
    {
        id: '02',
        title: '5 Things to Check Before Joining a Buyer Group',
        excerpt: 'Expert tips to ensure you make informed decisions when participating in group buying.',
        image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&q=80',
        date: 'Jan 10, 2026',
    },
    {
        id: '03',
        title: 'Understanding Home Loan Eligibility in 2026',
        excerpt: 'A comprehensive guide to home loan eligibility criteria and how to maximize your borrowing capacity.',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
        date: 'Jan 05, 2026',
    },
];

const BRAND_RED = "#D92228";

// --- Component: Kinetic Text Header (Enhanced) ---
const KineticHeader = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
    // Create a composite background image string from blog posts
    const bgImage = blogPosts.map(post => `url(${post.image})`).join(',');

    // Smooth out mouse movement for the spotlight
    const smoothX = useSpring(mouseX, { stiffness: 150, damping: 15 });
    const smoothY = useSpring(mouseY, { stiffness: 150, damping: 15 });

    // Create the dynamic mask gradient centered on mouse position
    const maskGradient = useMotionTemplate`radial-gradient(circle 350px at ${smoothX}px ${smoothY}px, black 20%, transparent 100%)`;

    // Increased size and weight for impact
    const titleClasses = "text-[13vw] leading-[0.8] font-black  uppercase tracking-tighter select-none";

    return (
        <div className="relative z-20 py-24 overflow-hidden pointer-events-none">

            {/* Layer 1: The Base Outline (Darker & Animated) */}
            <motion.h2
                animate={{ x: [-2, 2, -2] }} // Subtle jitter/glitch effect
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
                className={`${titleClasses} text-transparent font-serif bg-clip-text relative z-10 opacity-30`}
                style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px #ff0008', // Stone-800 Stroke
                }}
            >
                <span className="block">Market</span>
                <span className="block pl-[10vw]">Insights.</span>
            </motion.h2>

            {/* Layer 2: The Reveal Layer (Masked by mouse - Full Color Image) */}
            <motion.h2
                className={`${titleClasses} text-transparent bg-clip-text absolute top-24 left-0 z-20`}
                style={{
                    backgroundImage: bgImage,
                    backgroundSize: '150% auto',
                    backgroundPosition: 'center center',
                    maskImage: maskGradient,
                    WebkitMaskImage: maskGradient,
                }}
            >
                {/* Inner Motion for lively feel */}
                <motion.div
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-clip-text text-transparent"
                    style={{
                        backgroundImage: bgImage, // Images inside text
                        backgroundSize: '200% auto',
                    }}
                >
                    <span className="block">Market</span>
                    <span className="block pl-[10vw]">Insights.</span>
                </motion.div>
            </motion.h2>
        </div>
    );
};

// --- Component: Brutalist Article Item ---
const ArticleItem = ({ post, index }: { post: any, index: number }) => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useTransform(useScroll({ target: ref }).scrollYProgress, [0, 1], [0, 1]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative border-t border-stone-300 py-12 cursor-pointer"
            onClick={() => navigate('/blogs')}
        >
            <div className="grid grid-cols-12 gap-6 items-center">

                {/* Index & Date */}
                <div className="col-span-12 md:col-span-3 lg:col-span-2 flex md:flex-col justify-between md:justify-start items-start">
                    <span className="text-6xl font-thin text-stone-300 group-hover:text-[#D92228] transition-colors duration-500 leading-none">
                        {post.id}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase mt-2 text-stone-500 font-bold">
                        <Calendar size={12} />
                        {post.date}
                    </div>
                </div>

                {/* Title & Excerpt */}
                <div className="col-span-12 md:col-span-6 lg:col-span-5 relative z-20">
                    <h3 className="text-3xl md:text-4xl  text-stone-900 mb-4 leading-tight group-hover:underline decoration-[#D92228] decoration-2 underline-offset-4 transition-all">
                        {post.title}
                    </h3>
                    <p className="text-stone-600 font-light leading-relaxed text-lg">
                        {post.excerpt}
                    </p>
                    <div className="mt-6 flex items-center text-sm font-bold uppercase tracking-wider text-[#D92228] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        Read Editorial <ArrowUpRight className="ml-2" size={18} />
                    </div>
                </div>

                {/* Image Reveal Area */}
                <div className="hidden lg:block col-span-5 h-[320px] relative overflow-hidden">
                    {/* The image starts small and hidden, reveals on hover */}
                    <motion.div
                        className="absolute inset-0 bg-stone-100 transform scale-y-0 origin-bottom transition-transform duration-500 ease-[0.76, 0, 0.24, 1] group-hover:scale-y-100"
                    >
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100 transition-all duration-700 ease-out"
                        />
                    </motion.div>
                </div>

            </div>

            {/* Hover Follow Line */}
            <motion.div
                className="absolute bottom-0 left-0 h-[3px] bg-[#D92228]"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                style={{ scaleX: isInView, transformOrigin: 'left' }}
            />
        </motion.div>
    );
};

const LatestArticles = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    // Track mouse position relative to the section container
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative pt-16 pb-24 overflow-hidden bg-white border-t border-stone-200"
        >
            <div className="container mx-auto px-6 relative z-10">

                {/* Top Label */}
                {/* <div className="flex justify-between items-center mb-10 border-b border-stone-300 pb-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-stone-500 font-semibold">
                        Editorial // Q1 2026
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#D92228] flex items-center gap-2 font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#D92228] animate-pulse" />
                        Live Feed
                    </span>
                </div> */}

                {/* --- THE KINETIC TYPOGRAPHY HEADER (ENHANCED) --- */}
                <KineticHeader mouseX={mouseX} mouseY={mouseY} />

                {/* Intro Text placed strategically */}
                <div className="max-w-lg ml-auto -mt-16 mb-32 relative z-30 bg-white/80 backdrop-blur-sm p-4 border-l-2 border-[#D92228]">
                    <p className="text-xl text-stone-900 leading-relaxed">
                        Navigating the complexities of modern real estate through collective intelligence and strategic analysis.
                    </p>
                </div>

                {/* --- THE BRUTALIST ARTICLE LIST --- */}
                <div className="relative z-30">
                    {blogPosts.map((post, index) => (
                        <ArticleItem key={post.id} post={post} index={index} />
                    ))}
                </div>

                {/* Footer Button */}
                <div className="mt-24 flex justify-center relative z-30">
                    <Button
                        onClick={() => navigate('/blogs')}
                        variant="outline"
                        size="lg"
                        className="rounded-none border-2 border-stone-900 text-stone-900 uppercase font-bold tracking-wider px-12 h-14 hover:bg-stone-900 hover:text-white transition-colors duration-300"
                    >
                        View Full Archive
                    </Button>
                </div>

            </div>

            {/* Noise Texture Overlay for that high-end print feel */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-40" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise.png")' }}></div>
        </section>
    );
};

export default LatestArticles;
