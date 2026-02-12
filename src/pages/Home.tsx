'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Users, Handshake, Tag, CheckCircle, Calculator, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import PropertyCard from '@/components/properties/PropertyCard';
import type { Property } from '@/types/index';
import RegisterInterestModal from '@/components/properties/RegisterInterestModal';
import OTPAuthModal from '@/components/auth/OTPAuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { properties } from '@/data/properties';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Hero } from './Hero';
import { MissionScroll } from './MissionScroll';
import BlueprintHero from './BlueprintHero';
import FeaturedProperties from './FeaturedProperties';
import HowItWorks from '@/components/HowItWorks';
import LatestArticles from './LatestArticles';
import EMICalculator from './EMICalculator';
import FAQSection from './FAQSection';
import CTASection from './CTASection';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
};

const steps = [
  {
    icon: Search,
    title: 'Explore Properties',
    description: 'Browse residential projects based on your preferred location, configuration, and budget range.',
  },
  {
    icon: Users,
    title: 'Register Interest',
    description: 'Share your interest in a property so we can understand buyer demand and verify genuine intent.',
  },
  {
    icon: Handshake,
    title: 'Join Group',
    description: 'Verified buyers with similar requirements come together to form a focused group for the selected property.',
  },
  {
    icon: Tag,
    title: 'Get Group Discount',
    description: 'Once the group is aligned, pricing discussions are initiated to explore potential group-level benefits.',
  },
  {
    icon: CheckCircle,
    title: 'Individual Booking',
    description: 'Each buyer proceeds independently based on comfort, terms, and final decision.',
  },
];

const faqs = [
  {
    question: 'What is Let\'s Buy?',
    answer: 'Let\'s Buy is a group buying platform that helps verified home buyers come together to access better pricing through collective demand.',
  },
  {
    question: 'Is Let\'s Buy a broker?',
    answer: 'No. Let\'s Buy does not act as a traditional broker and does not charge brokerage from buyers.',
  },
  {
    question: 'Who can use Let\'s Buy?',
    answer: 'Let\'s Buy is designed for serious end-user home buyers who are actively planning to purchase a property.',
  },
  {
    question: 'Is the Joining Fee Refundable?',
    answer: 'Yes. The joining fee is fully refundable within the first 10 days from joining the group. After 10 days, the fee becomes non-refundable as Let\'s Buy has committed the buyer group to the developer.',
  },
];

const blogPosts = [
  {
    id: 1,
    title: 'How Group Buying is Changing Real Estate in India',
    excerpt: 'Discover how collective purchasing power is helping homebuyers save lakhs on their dream homes.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    date: 'Jan 15, 2026',
  },
  {
    id: 2,
    title: '5 Things to Check Before Joining a Buyer Group',
    excerpt: 'Expert tips to ensure you make informed decisions when participating in group buying.',
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&q=80',
    date: 'Jan 10, 2026',
  },
  {
    id: 3,
    title: 'Understanding Home Loan Eligibility in 2026',
    excerpt: 'A comprehensive guide to home loan eligibility criteria and how to maximize your borrowing capacity.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
    date: 'Jan 05, 2026',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/properties');
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleJoinGroup = (property: Property) => {
    if (isAuthenticated) {
      setSelectedProperty(property);
      setInterestModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleViewMore = (property: Property) => {
    navigate(`/properties/${property.id}`);
  };

  // EMI Calculation
  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const emi = calculateEMI();
  const totalAmount = emi * tenure * 12;
  const totalInterest = totalAmount - loanAmount;

  return (
    <>
      {/* Hero Section */}
      <Hero />
      <BlueprintHero />
      {/* <MissionScroll /> */}

      {/* Featured Properties Section */}
      <FeaturedProperties />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Blogs Section */}
      <LatestArticles />

      {/* EMI Calculator Section */}
      <EMICalculator />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection/>

      {/* Modals */}
      <OTPAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      <RegisterInterestModal
        isOpen={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        property={selectedProperty}
      />
    </>
  );
};

export default Home;
