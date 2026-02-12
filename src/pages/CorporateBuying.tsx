import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingDown, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OTPAuthModal from '@/components/auth/OTPAuthModal';
import { useAuth } from '@/contexts/AuthContext';

const benefits = [
  {
    icon: Users,
    title: 'Employee Benefits Program',
    description: 'Offer exclusive home buying discounts as part of your employee benefits package.',
  },
  {
    icon: TrendingDown,
    title: 'Corporate Rates',
    description: 'Access special corporate pricing for bulk employee home purchases.',
  },
  {
    icon: Building2,
    title: 'Dedicated Support',
    description: 'Get a dedicated relationship manager for your organization.',
  },
];

const features = [
  'Customized group buying programs for employees',
  'Exclusive developer partnerships',
  'Dedicated account management',
  'Employee financial literacy workshops',
  'Flexible payment options coordination',
  'Priority access to new projects',
];

const CorporateBuying: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/contact');
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-surface-offwhite py-16 md:py-24">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                For Organizations
              </span>
              <h1 className="heading-hero text-foreground mb-6">
                Corporate <span className="text-primary">Group Buying</span>
              </h1>
              <p className="body-large text-muted-foreground mb-8">
                Help your employees achieve their dream of home ownership with exclusive corporate group buying benefits. Partner with Let's Buy to offer unique real estate perks.
              </p>
              <Button onClick={handleGetStarted} size="lg" className="btn-primary h-12 px-8">
                Partner With Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                  alt="Corporate office"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-section text-foreground mb-4">Why Corporate Group Buying?</h2>
            <p className="body-base text-muted-foreground max-w-2xl mx-auto">
              Enhance your employee value proposition with exclusive home buying benefits.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-brand flex items-center justify-center mb-4">
                  <benefit.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-surface-offwhite">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-section text-foreground mb-6">What We Offer</h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl p-8"
            >
              <h3 className="heading-card text-foreground mb-4">Request a Partnership</h3>
              <p className="text-muted-foreground mb-6">
                Fill out our contact form and our corporate partnerships team will reach out within 24 hours.
              </p>
              <Button onClick={() => navigate('/contact')} className="w-full btn-primary h-12">
                Contact Our Team
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding gradient-brand">
        <div className="container-section">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '25+', label: 'Corporate Partners' },
              { value: '1000+', label: 'Employees Helped' },
              { value: '₹50 Cr+', label: 'Total Savings' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-4xl font-display font-bold text-primary-foreground mb-2">{stat.value}</p>
                <p className="text-primary-foreground/80">{stat.label}</p>
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

export default CorporateBuying;
