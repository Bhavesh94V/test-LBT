import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Users, Handshake, Tag, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OTPAuthModal from '@/components/auth/OTPAuthModal';
import { useAuth } from '@/contexts/AuthContext';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Explore Properties',
    description: 'Browse residential projects based on your preferred location, configuration, and budget range. We list verified properties from trusted developers across the city.',
    details: [
      'Filter by location, budget, and configuration',
      'See real-time buyer interest for each property',
      'Compare estimated savings across projects',
    ],
  },
  {
    icon: Users,
    number: '02',
    title: 'Register Interest',
    description: 'Share your interest in a property so we can understand buyer demand and verify genuine intent. This helps us create focused groups of serious buyers.',
    details: [
      'Simple form with your requirements',
      'No commitment at this stage',
      'Our team contacts you within 24 hours',
    ],
  },
  {
    icon: Handshake,
    number: '03',
    title: 'Join Group',
    description: 'Verified buyers with similar requirements come together to form a focused group for the selected property. Group size is optimized for maximum negotiating power.',
    details: [
      'Verified buyer groups only',
      'Similar requirements and timelines',
      'Transparent group dynamics',
    ],
  },
  {
    icon: Tag,
    number: '04',
    title: 'Get Group Discount',
    description: 'Once the group is aligned, pricing discussions are initiated to explore potential group-level benefits. We leverage collective buying power for better deals.',
    details: [
      'Collective negotiation with developers',
      'Transparent pricing discussions',
      'Estimated savings shared upfront',
    ],
  },
  {
    icon: CheckCircle,
    number: '05',
    title: 'Individual Booking',
    description: 'Each buyer proceeds independently based on comfort, terms, and final decision. You own your home individually - we just make the process smarter.',
    details: [
      'Direct booking with developer',
      'Individual ownership structure',
      'No forced commitments',
    ],
  },
];

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/properties');
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-surface-offwhite py-16 md:py-24">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Easy Process
            </span>
            <h1 className="heading-hero text-foreground mb-6">
              How <span className="text-primary">Let's Buy</span> Works
            </h1>
            <p className="body-large text-muted-foreground mb-8">
              A simple 5-step process to help you buy your dream home at a better price through the power of group buying.
            </p>
            <Button onClick={handleGetStarted} size="lg" className="btn-primary h-12 px-8">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
              >
                {/* Visual */}
                <div className="w-full md:w-1/2">
                  <div className="relative">
                    <div className="aspect-[4/3] bg-surface-offwhite rounded-2xl flex items-center justify-center overflow-hidden">
                      <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 gradient-brand rounded-3xl flex items-center justify-center">
                          <step.icon className="w-16 h-16 md:w-20 md:h-20 text-primary-foreground" />
                        </div>
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-foreground rounded-xl flex items-center justify-center text-background font-display font-bold text-lg">
                          {step.number}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                    Step {index + 1}
                  </span>
                  <h2 className="heading-card text-foreground mb-4">{step.title}</h2>
                  <p className="body-base text-muted-foreground mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="section-padding bg-surface-offwhite">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <blockquote className="text-2xl md:text-3xl font-display font-semibold text-foreground italic mb-8">
              "Let's Buy helps home buyers buy together, while deciding independently."
            </blockquote>
            <Button onClick={handleGetStarted} size="lg" className="btn-primary h-12 px-8">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">Why Choose Group Buying?</h2>
            <p className="body-base text-muted-foreground max-w-2xl mx-auto">
              Individual buyers often struggle to negotiate. Together, we create leverage.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Better Pricing', desc: 'Group leverage for discounts', icon: '💰' },
              { title: 'Zero Brokerage', desc: 'No broker commission for buyers', icon: '🛡️' },
              { title: 'Verified Buyers', desc: 'Only serious homebuyers', icon: '✅' },
              { title: 'Full Transparency', desc: 'Clear process at every step', icon: '🔍' },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface-offwhite rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-display font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <OTPAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};

export default HowItWorks;
