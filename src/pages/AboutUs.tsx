import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Landmark,
  FileCheck,
  Users2,
  ArrowRight,
  Check,
  Building2,
  Lock,
  SearchCheck,
  Quote,
  Target,
  Lightbulb,
  Globe2,
  PlayCircle,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Wallet,
  FileSignature,
  Scale,
  FileCheck2,
  Search,
  HandCoins,
  Users,
  ArrowDown,
  ShieldAlert,
  Tag,
  X,
  Home,
  Shield,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import OTPAuthModal from '@/components/auth/OTPAuthModal'
import { useAuth } from '@/contexts/AuthContext'
import WhatMakesUsDifferent from './WhatMakesUsDifferent'
const Heroimage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"

// --- Professional Data ---

const trustMetrics = [
  {
    label: 'Collective Value',
    value: '₹500 Cr+',
    desc: 'Homes Negotiated Together',
    icon: Building2
  },
  {
    label: 'Buyer Network',
    value: '12,000+',
    desc: 'Verified Homebuyers',
    icon: Users2
  },
  {
    label: 'Buyer Advantage',
    value: '₹45 Cr+',
    desc: 'Total Savings Unlocked',
    icon: TrendingUp
  }
]

const safetyFeatures = [
  {
    icon: Wallet,
    title: 'Escrow-Secured Buyer Deposit',
    desc: 'Your participation amount is held securely in a regulated, third-party escrow account. Let’s Buy never touches your money. If the group threshold is not achieved, your amount is refunded automatically in full.',
    badge: 'Risk-Free Entry'
  },
  {
    icon: FileSignature,
    title: 'Comprehensive Legal & RERA Checks',
    desc: 'Every project undergoes an in-depth legal review covering RERA registration, land ownership, approvals, and litigation history. Only legally compliant projects are opened for group participation.',
    badge: 'Legally Verified'
  },
  {
    icon: Scale,
    title: 'Buyer-Only Representation',
    desc: 'Unlike traditional brokers who represent developers, we act solely on behalf of buyers. Our mandate is simple: negotiate collectively to secure the best possible price and terms for the group.',
    badge: 'No Developer Bias'
  },
  {
    icon: ShieldCheck,
    title: 'Open & Equal Pricing',
    desc: 'The negotiated group price, terms, and benefits are transparently documented and shared with every participant. No side deals. No preferential treatment. Every buyer gets the same terms.',
    badge: 'Complete Transparency'
  }
]

const processSteps = [
  {
    id: '01',
    title: 'Explore Properties',
    desc: 'Browse residential projects based on your preferred location, configuration, and budget range.'
  },
  {
    id: '02',
    title: 'Register Interest',
    desc: 'Share your interest in a property so we can understand buyer demand and verify genuine intent.'
  },
  {
    id: '03',
    title: 'Join a Buyer Group',
    desc: 'Verified homebuyers with similar requirements come together to form a focused group for the selected project.'
  },
  {
    id: '04',
    title: 'Access Group-Level Benefits',
    desc: 'Once the group is aligned, pricing discussions are initiated with the developer to explore potential group-level advantages.'
  },
  {
    id: '05',
    title: 'Book Individually',
    desc: 'Each buyer proceeds independently based on comfort, final terms, and personal decision — no pressure or obligation.'
  }
]

const comparisonData = [
  {
    category: 'Buying Approach',
    icon: Users,
    standard: 'Individual & Fragmented',
    letsBuy: 'Collective Buying Power',
    standardDesc:
      'Each buyer negotiates alone with limited information and leverage.',
    letsBuyDesc:
      'Buyers come together as a single negotiating group with shared intent.'
  },
  {
    category: 'Price Discovery',
    icon: Tag,
    standard: 'Builder-Led Pricing',
    letsBuy: 'Group-Negotiated Pricing',
    standardDesc:
      'Prices are set unilaterally by the developer with little room to negotiate.',
    letsBuyDesc:
      'Prices are negotiated after aggregating demand across multiple buyers.'
  },
  {
    category: 'Brokerage & Fees',
    icon: Wallet,
    standard: 'Broker-Driven Costs',
    letsBuy: 'Zero Buyer Brokerage',
    standardDesc: 'Buyers indirectly pay commissions through inflated prices.',
    letsBuyDesc:
      'Buyers never pay brokerage. Our alignment is strictly buyer-side.'
  },
  {
    category: 'Information Access',
    icon: Search,
    standard: 'Limited Visibility',
    letsBuy: 'Full Transparency',
    standardDesc:
      'Inventory, pricing logic, and negotiation details remain opaque.',
    letsBuyDesc:
      'Negotiated prices, terms, and benefits are shared openly with all group members.'
  },
  {
    category: 'Legal & Compliance',
    icon: ShieldAlert,
    standard: 'Basic Safeguards',
    letsBuy: 'Institutional-Grade Due Diligence',
    standardDesc: 'Standard agreements prioritize the developer’s interests.',
    letsBuyDesc:
      'Every project is vetted through detailed legal, RERA, and compliance checks.'
  }
]

const AboutUs: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/properties')
    } else {
      setAuthModalOpen(true)
    }
  }

  return (
    <div className='bg-white text-slate-900 font-sans selection:bg-primary/10'>
      <section className='relative min-h-[75vh] mt-10 flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <img
            src={Heroimage}
            alt='Modern Architecture'
            className='w-full h-full object-cover scale-105'
          />

          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'></div>

          <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50' />
        </div>

        <div className='container-section relative z-10 pt-20 pb-32'>
          <div className='max-w-5xl mx-auto text-center'>
            {/* HEADLINE */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]'
            >
              Together, <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400'>
                We Are Stronger.
              </span>
            </motion.h1>

            {/* SUBHEADLINE */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light mb-10'
            >
              Let’s Buy brings verified homebuyers together to negotiate
              directly with developers and unlock
              <span className='text-white font-medium'>
                {' '}
                group-level pricing benefits{' '}
              </span>
              — while every buyer decides independently.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='flex flex-col sm:flex-row items-center justify-center gap-4'
            >
              <Button
                onClick={() => navigate('/login')}
                size='lg'
                className='h-14 px-8 bg-white text-slate-900 hover:bg-slate-100 rounded-sm font-semibold text-lg min-w-[220px]'
              >
                Get Started
                <ArrowRight className='ml-2 w-5 h-5' />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING METRICS SECTION */}
      <section className='relative z-20 px-4 -mt-24 mb-20'>
        <div className='container-section max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='bg-white rounded-lg shadow-2xl shadow-slate-900/20 border border-slate-100 cursor-pointer overflow-hidden'
          >
            <div className='grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100'>
              {trustMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className='group p-8 md:p-10 flex items-start gap-6 hover:bg-slate-50 transition-colors duration-300'
                >
                  {/* Icon Box */}
                  <div className='w-14 h-14 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300'>
                    <metric.icon className='w-7 h-7' />
                  </div>

                  {/* Text Content */}
                  <div>
                    <div className='flex items-baseline gap-1'>
                      <h3 className='text-3xl md:text-4xl font-bold text-slate-900 tracking-tight'>
                        {metric.value}
                      </h3>
                    </div>
                    <p className='text-sm font-bold text-slate-900 uppercase tracking-wider mt-1 mb-1'>
                      {metric.label}
                    </p>
                    <p className='text-sm text-slate-500'>{metric.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className='min-h-screen bg-white overflow-hidden flex flex-col lg:flex-row'>
        {/* --- Left Side: Visual Narrative --- */}
        <div className='w-full lg:w-1/2 relative h-[60vh] lg:h-screen bg-slate-900'>
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className='absolute inset-0'
          >
            <img
              src='https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop'
              alt='Modern Architecture'
              className='w-full h-full object-cover opacity-80'
            />
            <div className='absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/60'></div>
          </motion.div>

          <div className='absolute top-12 left-12 z-20'>
            <span className='text-white text-xs font-semibold tracking-[0.3em] uppercase'>
              Est. 2024
            </span>
          </div>

          <div className='absolute bottom-12 left-12 z-20 max-w-xs hidden md:block'>
            <p className='text-white/60 text-sm leading-relaxed italic'>
              "A more balanced way for people to move into homes — together."
            </p>
          </div>
        </div>

        {/* --- Right Side: Narrative Content --- */}
        <div className='w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-16 py-24 relative'>
          <div className='absolute top-0 left-0 w-1 h-32 bg-primary'></div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Label */}
            <div className='flex items-center gap-3 mb-10'>
              <span className='text-primary font-semibold text-sm tracking-widest uppercase'>
                Who We Are
              </span>
              <div className='h-px w-12 bg-slate-200'></div>
            </div>

            {/* Headline */}
            <h2 className='text-5xl md:text-6xl font-bold text-slate-900 mb-12 leading-[1.1] tracking-tight'>
              Building a{' '}
              <span className='text-primary italic'>fairer</span>
              <br />
              way to own a home.
            </h2>

            {/* Content */}
            <div className='space-y-10 max-w-xl'>
              <p className='text-xl text-slate-700 leading-relaxed'>
                At{' '}
                <span className='font-semibold text-slate-900'>Lets Buy</span>,
                we are reshaping how residential homes are purchased by bringing
                balance, transparency, and fairness back into the process.
              </p>

              <p className='text-lg text-slate-600 leading-relaxed'>
                Traditionally, individual homebuyers negotiate alone, often
                paying listed prices or navigating unclear terms, while
                institutions and bulk buyers secure better outcomes simply
                because they negotiate together.
              </p>

              <p className='text-lg text-slate-600 leading-relaxed'>
                We believe everyday homebuyers deserve access to the same
                advantage. Not through pressure or rushed decisions, but through
                clarity, confidence, and collective intent, while each buyer
                remains fully in control of their own decision.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className='min-h-screen bg-white overflow-hidden flex flex-col lg:flex-row'>
        {/* --- Left Side: Narrative Content (Now First) --- */}
        <div className='w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-16 py-24 relative order-2 lg:order-1'>
          {/* Accent Line */}
          <div className='absolute top-0 left-0 w-1 h-32 bg-primary'></div>

          <motion.div
            initial={{ opacity: 0, x: -40 }} // Animating from Left
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Label */}
            <div className='flex items-center gap-3 mb-10'>
              <span className='text-primary font-semibold text-sm tracking-widest uppercase'>
                What We Do
              </span>
              <div className='h-px w-12 bg-slate-200'></div>
            </div>

            {/* Headline */}
            <h2 className='text-5xl md:text-6xl font-bold text-slate-900 mb-12 leading-[1.1] tracking-tight'>
              Unlocking value through{' '}
              <span className='text-primary italic '>collective</span>
              <br />
              purchasing power.
            </h2>

            {/* Content */}
            <div className='space-y-8 max-w-xl'>
              <p className='text-xl text-slate-700 leading-relaxed'>
                <span className='font-semibold text-slate-900'>Lets Buy</span>{' '}
                helps home buyers with similar needs come together through group
                buying, enabling buyers to access better pricing opportunities
                that are difficult to achieve alone.
              </p>

              <p className='text-lg text-slate-600 leading-relaxed'>
                We bring verified buyers together, create focused buyer groups,
                and support structured discussions around pricing in
                collaboration with developers.
              </p>

              <div className='p-6 bg-slate-50 border-l-4 border-primary rounded-r-lg'>
                <p className='text-lg text-slate-800 font-medium leading-relaxed italic'>
                  "Each buyer still owns their home individually — we simply
                  make the process smarter and more balanced."
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- Right Side: Visual Narrative (Now Second) --- */}
        <div className='w-full lg:w-1/2 relative h-[60vh] lg:h-screen bg-slate-900 order-1 lg:order-2'>
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className='absolute inset-0'
          >
            {/* Using a different image to distinguish from the first section */}
            <img
              src='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop'
              alt='Structured Architecture'
              className='w-full h-full object-cover opacity-80'
            />
            <div className='absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/60'></div>
          </motion.div>

          {/* Decorative Badge */}
          <div className='absolute top-12 right-12 z-20'>
            <span className='text-white text-xs font-semibold tracking-[0.3em] uppercase'>
              Syndicate Model
            </span>
          </div>

          {/* Floating Stat/Quote */}
          <div className='absolute bottom-12 right-12 z-20 max-w-xs text-right hidden md:block'>
            <p className='text-white/80 text-sm leading-relaxed font-light'>
              Verified Groups • Structured Deals • Developer Collaboration
            </p>
          </div>
        </div>
      </section>

      <section className='py-24 bg-white relative overflow-hidden'>
        {/* Background Decor - Subtle Split Tone */}
        <div className='absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 transform origin-top-right z-0 pointer-events-none'></div>

        <div className='container-section relative z-10'>
          <div className='grid lg:grid-cols-12 gap-16 items-start'>
            {/* LEFT COLUMN: Visuals (Spans 5) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='lg:col-span-5 relative'
            >
              {/* Main Image Composition */}
              <div className='relative z-10'>
                <div className='aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 border-4 border-white'>
                  <img
                    src='https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80'
                    alt='Founders Meeting'
                    className='w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700'
                  />
                </div>
              </div>

              {/* Background Dot Pattern */}
              <div className='absolute -bottom-12 -left-12 opacity-10 z-0'>
                <div className='w-48 h-48 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]'></div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Content (Spans 7) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='lg:col-span-7 pt-8'
            >
              {/* Badge */}
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-8'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary'></span>
                From Let's Buy Founders
              </div>

              {/* Headline */}
              <h2 className='text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight'>
                "Buying together should <br />
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600'>
                  lead to better deals
                </span>
                , not more stress."
              </h2>

              {/* Narrative */}
              <div className='prose prose-lg text-slate-600 space-y-8'>
                {/* The Problem */}
                <p>
                  <strong className='text-slate-900 block mb-2 text-sm uppercase tracking-wide'>
                    The Problem Buyers Face
                  </strong>
                  The homebuyers in India bargain individually, with little
                  information and no pricing power. The suppliers, on the other
                  hand, sell in bulk. This creates a mismatch, leading to higher
                  prices, confusing offers, and unfair deals where the
                  homebuyers end up paying more than they should.
                </p>

                {/* The Insight */}
                <div className='bg-slate-900 text-slate-300 p-8 rounded-2xl relative overflow-hidden group'>
                  <div className='absolute top-0 right-0 p-6 opacity-10'>
                    <Quote className='w-16 h-16 text-white transform rotate-180' />
                  </div>

                  <strong className='text-white block mb-3 text-sm uppercase tracking-wide border-b border-white/10 pb-2 w-fit'>
                    The Let' sBuy Insight
                  </strong>

                  <p className='leading-relaxed relative z-10 font-light text-lg'>
                    Collective demand is the source of real savings. When
                    verified buyers band together, developers compete on terms
                    and prices. The true benefit isn’t just discounts — it’s{' '}
                    <span className='text-white font-semibold'>
                      transparent, group bargaining.
                    </span>
                  </p>
                </div>

                {/* The Solution */}
                <p>
                  <strong className='text-slate-900 block mb-2 text-sm uppercase tracking-wide'>
                    How Let's Buy Helps
                  </strong>
                  Let's Buy creates a single, strong buying group by bringing
                  serious buyers together on a single platform. We engage in
                  direct negotiations with developers to obtain reasonable
                  prices, consistent terms, and full transparency—so that each
                  buyer gains an equal share.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WhatMakesUsDifferent />

      <section className='py-24 bg-slate-50 relative overflow-hidden'>
        <div className='container-section relative z-10'>
          {/* Header */}
          <div className='text-center mb-24 max-w-3xl mx-auto'>
            <h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-6'>
              Stress free Steps for Your <br />
              <span className='text-primary'>Dream Home</span>
            </h2>
          </div>

          {/* The Timeline Container */}
          <div className='relative max-w-4xl mx-auto'>
            {/* SVG Curved Dotted Line Path */}
            <svg
              className='absolute top-0 left-1/2 -translate-x-1/2 h-full w-full -z-10 pointer-events-none'
              viewBox='0 0 800 1200'
              preserveAspectRatio='none'
            >
              <path
                d='M 400 100 Q 600 250 400 400 Q 200 550 400 700 Q 600 850 400 1000'
                fill='none'
                stroke='#cbd5e1' // slate-300
                strokeWidth='2'
                strokeDasharray='8 8' // Creates the dotted effect
              />
            </svg>

            <div className='space-y-32 md:space-y-0 relative'>
              {processSteps.map((step, idx) => {
                // Determine if card should be on left or right
                const isLeft = idx % 2 === 0

                // Card rotation/tilt logic based on side
                const rotationClass = isLeft
                  ? '-rotate-2 hover:rotate-0'
                  : 'rotate-2 hover:rotate-0'

                // Positioning logic
                const positionClass = isLeft
                  ? 'md:mr-auto md:ml-0'
                  : 'md:ml-auto md:mr-0'
                const textAlignment = isLeft
                  ? 'text-left'
                  : 'text-left md:text-right'

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 50, rotate: isLeft ? -5 : 5 }}
                    whileInView={{ opacity: 1, y: 0, rotate: isLeft ? -2 : 2 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`relative md:w-[45%] ${positionClass} md:mb-32 last:mb-0`}
                  >
                    {/* The Floating Dot on the path */}
                    <div
                      className={`absolute top-8 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-md z-20 
                     ${isLeft
                          ? '-right-12 md:-right-16'
                          : '-left-12 md:-left-16'
                        }`}
                    ></div>

                    {/* The Tilted Card */}
                    <div
                      className={`bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-300 ${rotationClass} hover:shadow-2xl hover:scale-[1.02] z-10 relative`}
                    >
                      {/* Step Number */}
                      <span className='text-primary/80 font-bold text-lg mb-2 block'>
                        {step.id}
                      </span>

                      <h3 className='text-xl font-bold text-slate-900 mb-3'>
                        {step.title}
                      </h3>

                      <p className='text-slate-600 text-sm leading-relaxed'>
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Comparison Table */}
      <section className='py-24 bg-slate-50 relative overflow-hidden'>
        {/* Background Blobs for Atmosphere */}
        <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none'></div>
        <div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none'></div>

        <div className='container-section relative z-10 max-w-6xl mx-auto px-4'>
          {/* Header Section */}
          <div className='text-center mb-20'>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className='inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-4'
            >
              The Smart Upgrade
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='text-3xl md:text-5xl font-bold text-slate-900 mb-6'
            >
              Buying Alone{' '}
              <span className='text-slate-300 px-2 font-light'>vs</span>{' '}
              <span className='text-primary decoration-wavy underline decoration-primary/30 underline-offset-4'>
                Buying Together
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='text-slate-500 text-lg max-w-2xl mx-auto'
            >
              Stop playing by the old rules. Use the power of community to
              unlock better deals and smarter choices.
            </motion.p>
          </div>

          {/* The New Comparison List */}
          <div className='space-y-6'>
            {comparisonData.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className='group relative flex flex-col md:flex-row items-center gap-4'
              >
                {/* LEFT SIDE: The Old Way (Muted/Smaller) */}
                <div className='w-full md:w-[35%] bg-slate-100/50 border border-slate-200 rounded-2xl p-6 relative grayscale hover:grayscale-0 transition-all duration-300'>
                  <div className='absolute top-4 right-4 text-slate-300'>
                    <XCircle className='w-5 h-5' />
                  </div>
                  <h3 className='text-slate-500 font-semibold text-lg mb-1 group-hover:text-slate-700 transition-colors'>
                    {item.standard}
                  </h3>
                  <p className='text-slate-400 text-sm leading-relaxed'>
                    {item.standardDesc}
                  </p>
                </div>

                {/* CENTER: Animated Arrow (Only visible on Desktop) */}
                <div className='hidden md:flex justify-center items-center w-[10%]'>
                  <div className='w-12 h-12 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300 z-10'>
                    <ArrowRight className='w-5 h-5 text-slate-300 group-hover:text-primary transition-colors' />
                  </div>
                  {/* Dotted Line behind arrow */}
                  <div className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-[2px] border-t-2 border-dotted border-slate-200 -z-0'></div>
                </div>

                {/* RIGHT SIDE: The Let's Buy Way (Highlighted/Larger) */}
                <div className='w-full md:w-[45%] bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-lg shadow-slate-200/50 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/20 group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden'>
                  {/* Subtle Gradient Glow on Hover */}
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                  <div className='flex items-start gap-4 relative z-10'>
                    <div className='mt-1 bg-primary/10 p-2 rounded-lg text-primary'>
                      <item.icon className='w-6 h-6' />{' '}
                      {/* Using your item icon or CheckCircle2 */}
                    </div>
                    <div>
                      <h3 className='text-slate-900 font-bold text-xl md:text-2xl mb-2'>
                        {item.letsBuy}
                      </h3>
                      <p className='text-slate-600 font-medium'>
                        {item.letsBuyDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <OTPAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  )
}

export default AboutUs
