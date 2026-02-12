'use client';

import React, { useState } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { publicInquiryApi } from '@/services/userApi';
import type { Property } from '@/types/index';

interface RegisterInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

const professions = [
  'Salaried Professional',
  'Business Owner / Self Employed',
  'Government/PSU',
  'Professional (Doctor, CA, Lawyer, etc.)',
  'Other',
];

const fundingOptions = [
  { value: 'home-loan-savings', label: 'Home loan + Savings' },
  { value: 'mostly-savings', label: 'Mostly savings' },
  { value: 'fully-funded', label: 'Fully Funded' },
  { value: 'not-sure', label: 'Not sure' },
];

const visitOptions = [
  { value: 'yes', label: 'Yes, I have visited' },
  { value: 'no', label: 'No, not yet' },
  { value: 'planning', label: 'Planning to visit' },
];

const RegisterInterestModal: React.FC<RegisterInterestModalProps> = ({ isOpen, onClose, property }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    profession: '',
    fundingPlan: '',
    visitStatus: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const propertyId = property?._id || property?.id;
    if (!propertyId) {
      toast({
        title: 'Error',
        description: 'Property information is missing',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Validate phone
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Clean phone to last 10 digits only (remove +91, spaces, etc.)
      const cleanPhone = formData.phone.replace(/[^0-9]/g, '').slice(-10);

      // Build payload - only include propertyId if it looks like a valid MongoDB ObjectId
      const isValidMongoId = /^[a-f\d]{24}$/i.test(propertyId);
      const payload: Record<string, any> = {
        fullName: formData.name,
        phone: cleanPhone,
        configurationInterested: property?.configurations?.[0] || '',
        timeline: formData.fundingPlan,
        comments: `Profession: ${formData.profession}. Funding: ${formData.fundingPlan}. Visit status: ${formData.visitStatus}`,
      };
      if (isValidMongoId) {
        payload.propertyId = propertyId;
      }

      // Call API to create property inquiry
      await publicInquiryApi.create(payload);

      toast({
        title: 'Success!',
        description: 'Your interest has been registered. We\'ll contact you soon!',
      });

      setIsSubmitted(true);
    } catch (error: any) {
      console.error('[PropertyInquiry] Error:', error);
      toast({
        title: 'Error',
        description: error?.message || error?.response?.data?.message || 'Failed to register interest',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      profession: '',
      fundingPlan: '',
      visitStatus: '',
    });
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen || !property) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            /* Success State */
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
              </motion.div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                Interest Registered!
              </h2>
              <p className="text-muted-foreground mb-6">
                Our team will reach out within 24 hours to discuss the next steps.
              </p>
              <Button onClick={handleClose} className="btn-primary">
                Continue Exploring
              </Button>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Header */}
              <div className="px-8 pt-8 pb-4">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Register Interest
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  for <span className="font-medium text-foreground">{property.name}</span>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="interest-name">Full Name *</Label>
                  <Input
                    id="interest-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest-phone">Phone Number *</Label>
                  <Input
                    id="interest-phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Profession *</Label>
                  <Select
                    value={formData.profession}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}
                    required
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your profession" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border">
                      {professions.map((profession) => (
                        <SelectItem key={profession} value={profession}>
                          {profession}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>How do you plan to fund this purchase? *</Label>
                  <RadioGroup
                    value={formData.fundingPlan}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fundingPlan: value }))}
                    className="space-y-2"
                  >
                    {fundingOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Have you visited this property yet? *</Label>
                  <RadioGroup
                    value={formData.visitStatus}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, visitStatus: value }))}
                    className="space-y-2"
                  >
                    {visitOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.value} id={`visit-${option.value}`} />
                        <Label htmlFor={`visit-${option.value}`} className="font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !formData.profession || !formData.fundingPlan || !formData.visitStatus}
                  className="w-full h-12 btn-primary mt-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Submit Interest'
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RegisterInterestModal;
