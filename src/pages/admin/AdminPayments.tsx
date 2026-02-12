'use client';

import React, { useState, useEffect } from 'react';
import { paymentApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Eye, Download, AlertCircle, Loader2 } from 'lucide-react';
import type { Payment } from '@/types/index';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  link_sent: { label: 'Link Sent', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: XCircle },
};

function VerifyPaymentModal({ payment, onVerify }: { payment: Payment; onVerify: (transactionId: string, notes: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button size="sm" className="gap-2"><CheckCircle className="h-4 w-4" />Verify</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Verify Payment</DialogTitle><DialogDescription>Manually verify payment received</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div><Label>Transaction ID</Label><Input placeholder="Enter transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="mt-2" /></div>
          <div><Label>Verification Notes</Label><Textarea placeholder="Add any verification notes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={() => { onVerify(transactionId, notes); setIsOpen(false); setTransactionId(''); setNotes(''); }}>Verify Payment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PaymentDetailsModal({ payment }: { payment: Payment }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm" className="gap-2 bg-transparent"><Eye className="h-4 w-4" />Details</Button></DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Payment Details</DialogTitle><DialogDescription>Complete payment information</DialogDescription></DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs font-semibold text-gray-500">Payment ID</Label><p className="text-sm font-mono mt-1">{payment._id}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Status</Label><div className="mt-1"><Badge className={STATUS_CONFIG[payment.status as keyof typeof STATUS_CONFIG]?.color}>{STATUS_CONFIG[payment.status as keyof typeof STATUS_CONFIG]?.label}</Badge></div></div>
            <div><Label className="text-xs font-semibold text-gray-500">Amount</Label><p className="text-sm font-bold mt-1">&#8377;{payment.amount}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Configuration</Label><p className="text-sm mt-1">{payment.configuration}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Payment Method</Label><p className="text-sm mt-1 capitalize">{payment.paymentMethod}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Created</Label><p className="text-sm mt-1">{payment.createdAt && new Date(payment.createdAt).toLocaleString()}</p></div>
          </div>
          {payment.transactionId && (<div className="bg-blue-50 border border-blue-200 rounded p-3"><Label className="text-xs font-semibold text-blue-900">Transaction ID</Label><p className="text-sm font-mono mt-1">{payment.transactionId}</p></div>)}
          {payment.externalLink && (<div className="bg-purple-50 border border-purple-200 rounded p-3"><Label className="text-xs font-semibold text-purple-900">Payment Link</Label><div className="flex gap-2 mt-2"><Input value={payment.externalLink} readOnly className="text-xs" /><Button size="sm" variant="outline" className="bg-transparent" onClick={() => navigator.clipboard.writeText(payment.externalLink || '')}>Copy</Button></div></div>)}
          {payment.status === 'completed' && payment.verifiedAt && (<div className="bg-green-50 border border-green-200 rounded p-3"><div className="flex items-center gap-2 mb-2"><CheckCircle className="h-4 w-4 text-green-600" /><span className="font-semibold text-sm text-green-900">Payment Verified</span></div>{payment.verificationNotes && (<p className="text-sm text-green-800">{payment.verificationNotes}</p>)}<p className="text-xs text-green-700 mt-1">Verified at: {new Date(payment.verifiedAt).toLocaleString()}</p></div>)}
          {payment.status === 'failed' && (<div className="bg-red-50 border border-red-200 rounded p-3"><div className="flex items-center gap-2 mb-2"><XCircle className="h-4 w-4 text-red-600" /><span className="font-semibold text-sm text-red-900">Payment Failed</span></div><p className="text-sm text-red-800">{payment.failureReason}</p></div>)}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentApi.getAll();
      setPayments(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesSearch = payment._id?.includes(searchTerm) || payment.transactionId?.includes(searchTerm) || payment.configuration.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleVerifyPayment = async (paymentId: string, transactionId: string, notes: string) => {
    try {
      await paymentApi.verifyPayment(paymentId, { transactionId, notes });
      setPayments(payments.map((p) => p._id === paymentId ? { ...p, status: 'completed', transactionId, verificationNotes: notes, verifiedAt: new Date().toISOString() } : p));
    } catch (err: any) {
      console.error('Failed to verify payment:', err);
      setPayments(payments.map((p) => p._id === paymentId ? { ...p, status: 'completed', transactionId, verificationNotes: notes, verifiedAt: new Date().toISOString() } : p));
    }
  };

  const statusCounts = {
    pending: payments.filter((p) => p.status === 'pending').length,
    link_sent: payments.filter((p) => p.status === 'link_sent').length,
    completed: payments.filter((p) => p.status === 'completed').length,
    failed: payments.filter((p) => p.status === 'failed').length,
  };

  const totalRevenue = payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + parseInt(p.amount), 0);

  return (
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">Payments Management</h1><p className="text-gray-600">Track and verify all payments</p></div>

        <div className="grid grid-cols-5 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">&#8377;{totalRevenue.toLocaleString()}</div></CardContent></Card>
          {Object.entries(statusCounts).map(([key, count]) => (
            <Card key={key}><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 capitalize">{key.replace('_', ' ')}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{count}</div></CardContent></Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search by ID or transaction..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="link_sent">Link Sent</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-stone-400" size={32} /></div>
            ) : filteredPayments.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-stone-400">No payments found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment._id}>
                        <TableCell className="font-mono text-sm">{payment._id?.slice(-8)}</TableCell>
                        <TableCell className="font-medium">&#8377;{payment.amount}</TableCell>
                        <TableCell className="text-sm capitalize">{payment.paymentMethod}</TableCell>
                        <TableCell><Badge className={STATUS_CONFIG[payment.status as keyof typeof STATUS_CONFIG]?.color}>{STATUS_CONFIG[payment.status as keyof typeof STATUS_CONFIG]?.label}</Badge></TableCell>
                        <TableCell className="text-xs text-gray-500">{payment.createdAt && new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <PaymentDetailsModal payment={payment} />
                            {payment.status === 'link_sent' && (<VerifyPaymentModal payment={payment} onVerify={(txnId, notes) => handleVerifyPayment(payment._id!, txnId, notes)} />)}
                            {payment.status === 'completed' && (<Button size="sm" variant="outline" className="gap-2 bg-transparent"><Download className="h-4 w-4" />Receipt</Button>)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
