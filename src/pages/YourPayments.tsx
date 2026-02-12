'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api';

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  verified: { label: 'Verified', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  link_sent: { label: 'Link Sent', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  refunded: { label: 'Refunded', icon: AlertCircle, color: 'bg-blue-100 text-blue-700' },
  failed: { label: 'Failed', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
};

const YourPayments: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    const fetchPayments = async () => {
      try {
        const response = await apiClient.get('/users/payments');
        const data = response.data?.data?.payments || response.data?.data || [];
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('[YourPayments] Failed to fetch payments:', err);
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [isAuthenticated]);

  // Calculate summary totals
  const totalPaid = payments
    .filter((p: any) => p.status === 'completed' || p.status === 'verified')
    .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);
  const totalRefunded = payments
    .filter((p: any) => p.status === 'refunded')
    .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);
  const totalPending = payments
    .filter((p: any) => p.status === 'pending' || p.status === 'link_sent')
    .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

  const formatAmount = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lacs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  if (!isAuthenticated) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Please Login</h2>
          <p className="text-muted-foreground mb-6">You need to login to view your payments.</p>
          <Button onClick={() => navigate('/properties')} className="bg-[#D92228] hover:bg-[#b01c21] text-white">
            Explore Properties
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-surface-offwhite py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Payments</h1>
            <p className="text-muted-foreground">
              View and track all your payment history and transactions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid sm:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-offwhite rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-foreground">{formatAmount(totalPaid)}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-offwhite rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Refunded</p>
              <p className="text-2xl font-bold text-[#D92228]">{formatAmount(totalRefunded)}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-offwhite rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-foreground">{formatAmount(totalPending)}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Payments List */}
      <section className="py-12 bg-background pt-0">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-xl font-bold text-foreground mb-6">Transaction History</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#D92228]" />
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment: any, index: number) => {
                const status = payment.status || 'pending';
                const config = statusConfig[status] || statusConfig.pending;
                const StatusIcon = config.icon;
                const propertyName = payment.propertyId?.name || payment.property?.name || 'Payment';
                const amount = payment.amount || '0';
                const date = payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

                return (
                  <motion.div
                    key={payment._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface-offwhite rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#D92228] flex items-center justify-center shrink-0">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">{propertyName} - {payment.configuration || 'Group Fee'}</p>
                        <p className="text-sm text-muted-foreground">
                          {date}{payment.transactionId ? ` | ${payment.transactionId}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      <Badge className={config.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                      <p className={`text-lg font-semibold ${status === 'refunded' ? 'text-[#D92228]' : 'text-foreground'}`}>
                        {status === 'refunded' ? '+' : ''}₹{typeof amount === 'number' ? amount.toLocaleString('en-IN') : amount}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Payments Yet</h3>
              <p className="text-muted-foreground">
                You haven't made any payments yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default YourPayments;
