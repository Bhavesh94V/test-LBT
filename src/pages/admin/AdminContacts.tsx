'use client';

import React, { useState, useEffect } from 'react';
import { inquiryApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, CheckCircle, XCircle, Send, Eye, Loader2 } from 'lucide-react';
import type { InterestStatus } from '@/types/index';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  verified: { label: 'Verified', color: 'bg-blue-100 text-blue-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  payment_link_sent: { label: 'Link Sent', color: 'bg-purple-100 text-purple-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  grouped: { label: 'Grouped', color: 'bg-emerald-100 text-emerald-800' },
};

function InquiryDetailsModal({ inquiry }: { inquiry: InterestStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm" className="gap-2 bg-transparent"><Eye className="h-4 w-4" />View</Button></DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Inquiry Details</DialogTitle><DialogDescription>Complete information about the inquiry</DialogDescription></DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs font-semibold text-gray-500">Name</Label><p className="text-sm font-medium mt-1">{inquiry.userName}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Status</Label><div className="mt-1"><Badge className={STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG]?.color}>{STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG]?.label}</Badge></div></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><div><Label className="text-xs font-semibold text-gray-500">Email</Label><p className="text-sm mt-1">{inquiry.email}</p></div></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /><div><Label className="text-xs font-semibold text-gray-500">Phone</Label><p className="text-sm mt-1">{inquiry.phone}</p></div></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><div><Label className="text-xs font-semibold text-gray-500">City</Label><p className="text-sm mt-1">{inquiry.city}</p></div></div>
            <div><Label className="text-xs font-semibold text-gray-500">Configuration</Label><p className="text-sm font-medium mt-1">{inquiry.configuration}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Budget Range</Label><p className="text-sm font-medium mt-1">{inquiry.budgetRange}</p></div>
          </div>
          {inquiry.message && (<div><Label className="text-xs font-semibold text-gray-500">Message</Label><p className="text-sm border rounded p-2 bg-gray-50 mt-1">{inquiry.message}</p></div>)}
          {inquiry.status === 'verified' && inquiry.verificationNotes && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="flex items-center gap-2 mb-2"><CheckCircle className="h-4 w-4 text-blue-600" /><span className="font-semibold text-sm text-blue-900">Verified</span></div>
              <p className="text-sm text-blue-800">{inquiry.verificationNotes}</p>
            </div>
          )}
          {inquiry.paymentLink && (
            <div className="bg-purple-50 border border-purple-200 rounded p-3">
              <Label className="text-xs font-semibold text-purple-900">Payment Link</Label>
              <div className="flex gap-2 mt-2">
                <Input value={inquiry.paymentLink} readOnly className="text-xs" />
                <Button size="sm" variant="outline" className="bg-transparent" onClick={() => navigator.clipboard.writeText(inquiry.paymentLink || '')}>Copy</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VerifyInquiryModal({ inquiry, onVerify }: { inquiry: InterestStatus; onVerify: (notes: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button size="sm" variant="default" className="gap-2"><CheckCircle className="h-4 w-4" />Verify</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Verify Inquiry</DialogTitle><DialogDescription>Verify the inquiry for {inquiry.userName}</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div><Label>Verification Notes</Label><Textarea placeholder="Enter verification details..." value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={() => { onVerify(notes); setIsOpen(false); setNotes(''); }}>Verify Inquiry</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SendPaymentLinkModal({ inquiry, onSend }: { inquiry: InterestStatus; onSend: (paymentMethod: string, paymentLink: string, expiryDays: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [paymentLink, setPaymentLink] = useState('');
  const [expiryDays, setExpiryDays] = useState('7');
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button size="sm" variant="default" className="gap-2"><Send className="h-4 w-4" />Send Link</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Send Payment Link</DialogTitle><DialogDescription>Send external payment link to {inquiry.userName}</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div><Label>Payment Method</Label><Select value={paymentMethod} onValueChange={setPaymentMethod}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="razorpay">Razorpay Link</SelectItem><SelectItem value="bank_transfer">Bank Transfer Details</SelectItem><SelectItem value="upi">UPI Details</SelectItem><SelectItem value="manual">Manual Payment Link</SelectItem></SelectContent></Select></div>
          <div><Label>Payment Link / Details</Label><Textarea placeholder="Enter payment link or bank details..." value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} className="mt-2" /></div>
          <div><Label>Expiry (Days)</Label><Input type="number" min="1" max="90" value={expiryDays} onChange={(e) => setExpiryDays(e.target.value)} className="mt-2" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={() => { onSend(paymentMethod, paymentLink, parseInt(expiryDays)); setIsOpen(false); setPaymentLink(''); }}>Send Payment Link</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RejectInquiryModal({ inquiry, onReject }: { inquiry: InterestStatus; onReject: (reason: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button size="sm" variant="destructive" className="gap-2"><XCircle className="h-4 w-4" />Reject</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Reject Inquiry</DialogTitle><DialogDescription>Reject the inquiry from {inquiry.userName}</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div><Label>Rejection Reason</Label><Textarea placeholder="Provide a reason for rejection..." value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent">Cancel</Button>
            <Button variant="destructive" onClick={() => { onReject(reason); setIsOpen(false); setReason(''); }}>Reject Inquiry</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminContacts() {
  const [inquiries, setInquiries] = useState<InterestStatus[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await inquiryApi.getAll();
      setInquiries(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching inquiries:', err);
      setError(err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesSearch = inquiry.userName.toLowerCase().includes(searchTerm.toLowerCase()) || inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) || inquiry.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleVerify = async (inquiryId: string, notes: string) => {
    try {
      const response = await inquiryApi.verifyInquiry(inquiryId, { notes });
      setInquiries(inquiries.map((i) => i._id === inquiryId ? (response.data || { ...i, status: 'verified', verificationNotes: notes }) : i));
    } catch (err: any) {
      console.error('Failed to verify inquiry:', err);
      setInquiries(inquiries.map((i) => i._id === inquiryId ? { ...i, status: 'verified', verificationNotes: notes } : i));
    }
  };

  const handleSendPaymentLink = async (inquiryId: string, method: string, link: string, expiryDays: number) => {
    try {
      const response = await inquiryApi.sendPaymentLink(inquiryId, { paymentMethod: method, paymentLink: link, expiryDays });
      setInquiries(inquiries.map((i) => i._id === inquiryId ? (response.data || { ...i, status: 'payment_link_sent', paymentMethod: method as any, paymentLink: link }) : i));
    } catch (err: any) {
      console.error('Failed to send payment link:', err);
      setInquiries(inquiries.map((i) => i._id === inquiryId ? { ...i, status: 'payment_link_sent', paymentMethod: method as any, paymentLink: link } : i));
    }
  };

  const handleReject = async (inquiryId: string, reason: string) => {
    try {
      const response = await inquiryApi.rejectInquiry(inquiryId, { reason });
      setInquiries(inquiries.map((i) => i._id === inquiryId ? (response.data || { ...i, status: 'rejected' }) : i));
    } catch (err: any) {
      console.error('Failed to reject inquiry:', err);
      setInquiries(inquiries.map((i) => i._id === inquiryId ? { ...i, status: 'rejected' } : i));
    }
  };

  const statusCounts = {
    pending: inquiries.filter((i) => i.status === 'pending').length,
    verified: inquiries.filter((i) => i.status === 'verified').length,
    payment_link_sent: inquiries.filter((i) => i.status === 'payment_link_sent').length,
    paid: inquiries.filter((i) => i.status === 'paid').length,
    rejected: inquiries.filter((i) => i.status === 'rejected').length,
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inquiries Management</h1>
          <p className="text-gray-600">Track and manage all property inquiries</p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {Object.entries(statusCounts).map(([key, count]) => (
            <Card key={key}>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600 capitalize">{key.replace('_', ' ')}</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{count}</div></CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Inquiries</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search inquiries..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="payment_link_sent">Link Sent</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-stone-400" size={32} /></div>
            ) : filteredInquiries.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-stone-400">No inquiries found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Created At</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInquiries.map((inquiry) => (
                    <TableRow key={inquiry._id}>
                      <TableCell>{inquiry.userName}</TableCell>
                      <TableCell className="text-sm">{inquiry.email}</TableCell>
                      <TableCell><Badge className={STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG]?.color}>{STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG]?.label}</Badge></TableCell>
                      <TableCell className="text-xs text-gray-500">{inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end flex-wrap">
                          <InquiryDetailsModal inquiry={inquiry} />
                          {inquiry.status === 'pending' && (<><VerifyInquiryModal inquiry={inquiry} onVerify={(notes) => handleVerify(inquiry._id!, notes)} /><RejectInquiryModal inquiry={inquiry} onReject={(reason) => handleReject(inquiry._id!, reason)} /></>)}
                          {inquiry.status === 'verified' && (<SendPaymentLinkModal inquiry={inquiry} onSend={(method, link, days) => handleSendPaymentLink(inquiry._id!, method, link, days)} />)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
