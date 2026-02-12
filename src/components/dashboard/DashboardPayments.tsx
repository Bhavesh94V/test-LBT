'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import apiService from '@/services/api';

const statusConfig: Record<string, any> = {
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  refunded: { label: 'Refunded', icon: AlertCircle, color: 'bg-blue-100 text-blue-700' },
  failed: { label: 'Failed', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  verified: { label: 'Verified', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
};

const DashboardPayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalPaid: 0, totalRefunded: 0, activeCommitments: 0 });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await apiService.getUserPayments();
        const data = response?.data?.data?.payments || response?.data?.data || response?.data?.payments || [];
        const paymentsArr = Array.isArray(data) ? data : [];
        setPayments(paymentsArr);

        // Calculate summary
        let totalPaid = 0;
        let totalRefunded = 0;
        paymentsArr.forEach((p: any) => {
          const amount = p.amount || 0;
          if (p.status === 'refunded') totalRefunded += amount;
          else if (p.status === 'completed' || p.status === 'verified') totalPaid += amount;
        });
        setSummary({ totalPaid, totalRefunded, activeCommitments: totalPaid - totalRefunded });
      } catch (error: any) {
        console.error('[DashboardPayments] Error:', error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#D92228]" />
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Your Payments</h2>
        <p className="text-stone-500">View and track all your payment history and transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-stone-50 rounded-xl p-6 border border-stone-200">
          <p className="text-sm text-stone-500 mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-stone-900">{formatAmount(summary.totalPaid)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-stone-50 rounded-xl p-6 border border-stone-200">
          <p className="text-sm text-stone-500 mb-1">Total Refunded</p>
          <p className="text-2xl font-bold text-[#D92228]">{formatAmount(summary.totalRefunded)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-stone-50 rounded-xl p-6 border border-stone-200">
          <p className="text-sm text-stone-500 mb-1">Active Commitments</p>
          <p className="text-2xl font-bold text-stone-900">{formatAmount(summary.activeCommitments)}</p>
        </motion.div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-xl font-bold text-stone-900 mb-6">Transaction History</h3>
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment: any, index: number) => {
              const status = payment.status || 'pending';
              const config = statusConfig[status] || statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={payment._id || payment.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-stone-50 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-stone-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D92228] flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 mb-1">{payment.description || payment.purpose || 'Payment'}</p>
                      <p className="text-sm text-stone-500">
                        {new Date(payment.createdAt || payment.date).toLocaleDateString()} {payment.transactionId ? `- ${payment.transactionId}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <Badge className={config.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                    <p className={`text-lg font-semibold ${status === 'refunded' ? 'text-[#D92228]' : 'text-stone-900'}`}>
                      {status === 'refunded' ? '+' : ''}{formatAmount(payment.amount || 0)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-stone-50 rounded-2xl">
            <CreditCard className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-stone-900 mb-2">No Payments Yet</h3>
            <p className="text-stone-500">You haven't made any payments yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardPayments;
