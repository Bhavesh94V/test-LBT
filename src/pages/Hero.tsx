import * as React from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowRight, MapPin, ChevronLeft, ChevronRight
} from "lucide-react"
// FIX: Using react-router-dom instead of next/link
import { Link } from "react-router-dom"

// --- DATA: Featured Properties for the Slider ---
const SLIDES = [
    {
        id: 1,
        image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "GRAND ARCH",
        subtitle: "Sector 58, Gurgaon",
        price: "₹3.5 Cr",
        tag: "Group Deal Live"
    },
    {
        id: 2,
        image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "THE CAMELLIAS",
        subtitle: "DLF Phase 5",
        price: "₹8.5 Cr",
        tag: "Luxury Collection"
    },
    {
        id: 3,
        image: "https://images.pexels.com/photos/1488327/pexels-photo-1488327.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        title: "SMART WORLD",
        subtitle: "Golf Course Ext.",
        price: "₹2.2 Cr",
        tag: "Pre-Launch Access"
    }
]

export function Hero() {
    const [current, setCurrent] = React.useState(0)

    // Logic to change slides
    const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length)
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))

    return (
        <section className="relative mt-10 h-screen lg:h-[85vh] w-full bg-[#f4f4f4] overflow-hidden flex flex-col justify-center">

            {/* --- 1. BACKGROUND DECORATIVE TEXT (Static) --- */}
            <div className="absolute top-[10%] left-[2%] z-0 select-none pointer-events-none">
                <h1 className="text-[15vw] font-black text-black/5 leading-none tracking-tighter">
                    PREMIUM
                </h1>
            </div>
            <div className="absolute bottom-[5%] right-[2%] z-0 select-none pointer-events-none">
                <h1 className="text-[15vw] font-black text-black/5 leading-none tracking-tighter text-right">
                    LIVING
                </h1>
            </div>

            {/* --- 2. MAIN CONTENT GRID --- */}
            <div className="container mx-auto px-4 relative z-10 grid grid-cols-12 h-full items-center">

                {/* LEFT SIDE: Text Content */}
                <div className="col-span-12 lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 mt-8 lg:mt-0 lg:pr-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="space-y-6"
                        >
                            {/* Badge */}
                            <div className="flex items-center gap-3">
                                <span className="h-[2px] w-8 bg-primary"></span>
                                <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                                    {SLIDES[current].tag}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-5xl md:text-7xl font-medium text-black leading-[0.9]">
                                {SLIDES[current].title}
                            </h2>

                            {/* Location & Price */}
                            <div className="flex flex-col gap-2 border-l-2 border-black/10 pl-4 my-4">
                                <p className="text-lg font-medium text-gray-500 flex items-center gap-2">
                                    <MapPin size={18} className="text-primary" /> {SLIDES[current].subtitle}
                                </p>
                                <p className="text-4xl font-bold text-black tracking-tight">{SLIDES[current].price}</p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="pt-4 flex flex-wrap gap-4">
                                {/* FIX: Using Link with 'to' prop instead of 'href' */}
                                <Link to="/properties">
                                    <Button className="rounded-none bg-black text-white px-8 h-14 text-lg hover:bg-primary transition-all duration-300 flex items-center gap-4 group shadow-xl">
                                        View Details <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>

                                {/* Mobile Navigation Controls */}
                                <div className="flex lg:hidden gap-2">
                                    <button onClick={prevSlide} className="w-14 h-14 border border-black/10 flex items-center justify-center bg-white active:bg-gray-100">
                                        <ChevronLeft />
                                    </button>
                                    <button onClick={nextSlide} className="w-14 h-14 border border-black/10 flex items-center justify-center bg-white active:bg-gray-100">
                                        <ChevronRight />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* RIGHT SIDE: The Curtain Reveal Slider */}
                <div className="col-span-12 lg:col-span-7 relative h-[50vh] lg:h-full order-1 lg:order-2 w-full">
                    <div className="relative w-full h-full lg:absolute lg:inset-y-0 lg:right-[-50vw] lg:w-[100vw]">

                        <div className="relative w-full h-full lg:w-[65%] bg-gray-200">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={current}
                                    initial={{ clipPath: "inset(0 0 100% 0)" }}
                                    animate={{ clipPath: "inset(0 0 0% 0)" }}
                                    exit={{ clipPath: "inset(0 0 100% 0)" }}
                                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 z-10"
                                >
                                    <img
                                        src={SLIDES[current].image}
                                        alt="Property"
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                                </motion.div>
                            </AnimatePresence>

                            {/* Desktop Navigation Controls */}
                            <div className="hidden lg:flex absolute bottom-0 left-0 z-30 bg-white">
                                <button
                                    onClick={prevSlide}
                                    className="w-24 h-24 flex items-center justify-center border-r border-t border-gray-100 hover:bg-black hover:text-white transition-all duration-300 group"
                                >
                                    <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-24 h-24 flex items-center justify-center border-t border-gray-100 hover:bg-black hover:text-white transition-all duration-300 group"
                                >
                                    <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Slide Counter */}
                            <div className="absolute top-10 right-10 lg:right-[40%] z-30 text-white font-mono text-xl tracking-widest font-bold drop-shadow-md">
                                0{current + 1} <span className="opacity-60 text-sm">/ 0{SLIDES.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
