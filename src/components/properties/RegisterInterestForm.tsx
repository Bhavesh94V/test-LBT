'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Property } from '@/types';
import { publicInquiryApi } from '@/services/userApi';
import { useToast } from '@/hooks/use-toast';

const safePriceRange = (pr: any): string => {
  if (!pr) return '';
  if (typeof pr === 'string') return pr;
  if (typeof pr === 'object' && pr !== null) {
    const min = pr.min ?? pr.minimum ?? 0;
    const max = pr.max ?? pr.maximum ?? 0;
    const fmt = (v: number) => v >= 10000000 ? `${(v / 10000000).toFixed(1)} Cr` : v >= 100000 ? `${(v / 100000).toFixed(0)} Lacs` : `${v}`;
    return max ? `₹${fmt(min)} - ₹${fmt(max)}` : `₹${fmt(min)}+`;
  }
  return String(pr);
};

interface RegisterInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

const RegisterInterestModal: React.FC<RegisterInterestModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phone: '',
    configuration: property.configurations[0] || '',
    budgetRange: safePriceRange(property.priceRange),
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call backend API to submit interest
      await publicInquiryApi.create({
        propertyId: property._id || property.id,
        fullName: formData.userName,
        email: formData.email,
        phone: formData.phone.replace(/[^0-9]/g, ''),
        configurationInterested: formData.configuration,
        timeline: formData.budgetRange,
        comments: formData.message || undefined,
      });

      toast({ title: 'Interest Submitted!', description: 'Our team will contact you within 24 hours.' });

      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('form');
        setFormData({
          userName: '',
          email: '',
          phone: '',
          configuration: property.configurations[0] || '',
          budgetRange: safePriceRange(property.priceRange),
          message: '',
        });
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting interest:', error);
      toast({ title: 'Error', description: error?.response?.data?.message || error?.message || 'Failed to submit. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>

            {step === 'form' ? (
              <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Express Your Interest</h2>
                <p className="text-stone-600 mb-6">{property.name}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      type="text"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      placeholder="Your full name"
                      required
                      className="mt-2"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                      className="mt-2"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label>Phone Number *</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      required
                      className="mt-2"
                    />
                  </div>

                  {/* Configuration */}
                  <div>
                    <Label>Preferred Configuration *</Label>
                    <select
                      value={formData.configuration}
                      onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
                      className="w-full px-3 py-2 mt-2 border border-stone-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D92228]"
                    >
                      {property.configurations.map((config) => (
                        <option key={config} value={config}>{config}</option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <Label>Budget Range</Label>
                    <Input
                      type="text"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      placeholder="Budget range"
                      className="mt-2"
                      disabled
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <Label>Message (Optional)</Label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any additional information or questions..."
                      rows={3}
                      className="w-full px-3 py-2 mt-2 border border-stone-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D92228] resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-stone-200">
                    <Button
                      type="button"
                      onClick={onClose}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#D92228] hover:bg-red-700 text-white gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Submit Interest
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-stone-500 text-center">
                    No payment required. Admin will verify and send you payment link.
                  </p>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <CheckCircle size={64} className="text-green-600 mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-stone-900 mb-2">Interest Submitted!</h3>
                <p className="text-stone-600 text-center">
                  Thank you for your interest. Our team will verify your details and send you a payment link within 24 hours via email and SMS.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RegisterInterestModal;
