'use client';

import React, { useState, useEffect } from 'react';
import { settingsApi } from '@/services/adminApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, CheckCircle, Loader2, Send, AlertCircle } from 'lucide-react';

interface Settings {
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  defaultPaymentMethod: 'razorpay' | 'bank_transfer' | 'upi';
  razorpayKeyId: string;
  razorpaySecretKey: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankName: string;
  ifscCode: string;
  upiId: string;
  whatsappNumber: string;
  mailgunApiKey: string;
  commissionPercentage: number;
  defaultGroupSlotSize: number;
  defaultJoinDeadlineDays: number;
  adminEmails: string;
  autoApproveInterests: boolean;
}

const INITIAL_SETTINGS: Settings = {
  siteName: "Let's Buy",
  siteEmail: 'admin@letsbuy.com',
  sitePhone: '+91 98765 43210',
  defaultPaymentMethod: 'razorpay',
  razorpayKeyId: '',
  razorpaySecretKey: '',
  bankAccountNumber: '',
  bankAccountHolder: '',
  bankName: '',
  ifscCode: '',
  upiId: '',
  whatsappNumber: '+91 98765 43210',
  mailgunApiKey: '',
  commissionPercentage: 2.5,
  defaultGroupSlotSize: 10,
  defaultJoinDeadlineDays: 7,
  adminEmails: 'admin@letsbuy.com',
  autoApproveInterests: false,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testSmsPhone, setTestSmsPhone] = useState('');
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testSmsSending, setTestSmsSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.get();
      if (response.data) {
        setSettings({ ...INITIAL_SETTINGS, ...response.data });
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsApi.update(settings);
      setSaved(true);
      setError(null);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailAddress) return;
    setTestEmailSending(true);
    setTestResult(null);
    try {
      await settingsApi.testEmail(testEmailAddress);
      setTestResult('Test email sent successfully!');
    } catch (err: any) {
      setTestResult('Failed to send test email: ' + (err.message || 'Unknown error'));
    } finally {
      setTestEmailSending(false);
    }
  };

  const handleTestSms = async () => {
    if (!testSmsPhone) return;
    setTestSmsSending(true);
    setTestResult(null);
    try {
      await settingsApi.testSms(testSmsPhone);
      setTestResult('Test SMS sent successfully!');
    } catch (err: any) {
      setTestResult('Failed to send test SMS: ' + (err.message || 'Unknown error'));
    } finally {
      setTestSmsSending(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-stone-400" size={32} /></div>
    );
  }

  return (
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold">System Settings</h1><p className="text-gray-600">Configure application and payment settings</p></div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-800"><CheckCircle className="h-5 w-5" />Settings saved successfully!</div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800"><AlertCircle className="h-5 w-5" />{error}</div>
        )}
        {testResult && (
          <div className={`border rounded-lg p-4 flex items-center gap-2 ${testResult.includes('Failed') ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
            {testResult.includes('Failed') ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}{testResult}
          </div>
        )}

        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader><CardTitle>General Settings</CardTitle><CardDescription>Basic application information</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Site Name</Label><Input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="mt-1" /></div>
                <div><Label>Site Email</Label><Input type="email" value={settings.siteEmail} onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })} className="mt-1" /></div>
                <div><Label>Site Phone</Label><Input value={settings.sitePhone} onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })} className="mt-1" /></div>
                <div><Label>WhatsApp Number</Label><Input value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} className="mt-1" /></div>
              </div>
              <div><Label>Admin Email Addresses (comma separated)</Label><Textarea value={settings.adminEmails} onChange={(e) => setSettings({ ...settings, adminEmails: e.target.value })} className="mt-1" /></div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader><CardTitle>Payment Settings</CardTitle><CardDescription>Configure payment methods and gateways</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Default Payment Method</Label>
                <Select value={settings.defaultPaymentMethod} onValueChange={(value: any) => setSettings({ ...settings, defaultPaymentMethod: value })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="razorpay">Razorpay</SelectItem><SelectItem value="bank_transfer">Bank Transfer</SelectItem><SelectItem value="upi">UPI</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-3 border rounded p-4 bg-gray-50">
                <h3 className="font-semibold text-sm">Razorpay Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-xs">Razorpay Key ID</Label><Input value={settings.razorpayKeyId} onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs">Razorpay Secret Key</Label><Input type="password" value={settings.razorpaySecretKey} onChange={(e) => setSettings({ ...settings, razorpaySecretKey: e.target.value })} className="mt-1" /></div>
                </div>
              </div>
              <div className="space-y-3 border rounded p-4 bg-gray-50">
                <h3 className="font-semibold text-sm">Bank Transfer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-xs">Account Number</Label><Input value={settings.bankAccountNumber} onChange={(e) => setSettings({ ...settings, bankAccountNumber: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs">Account Holder Name</Label><Input value={settings.bankAccountHolder} onChange={(e) => setSettings({ ...settings, bankAccountHolder: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs">Bank Name</Label><Input value={settings.bankName} onChange={(e) => setSettings({ ...settings, bankName: e.target.value })} className="mt-1" /></div>
                  <div><Label className="text-xs">IFSC Code</Label><Input value={settings.ifscCode} onChange={(e) => setSettings({ ...settings, ifscCode: e.target.value })} className="mt-1" /></div>
                </div>
              </div>
              <div className="space-y-3 border rounded p-4 bg-gray-50">
                <h3 className="font-semibold text-sm">UPI Configuration</h3>
                <div><Label className="text-xs">UPI ID</Label><Input value={settings.upiId} onChange={(e) => setSettings({ ...settings, upiId: e.target.value })} className="mt-1" /></div>
              </div>
              <div><Label>Commission Percentage (%)</Label><Input type="number" step="0.1" value={settings.commissionPercentage} onChange={(e) => setSettings({ ...settings, commissionPercentage: parseFloat(e.target.value) })} className="mt-1" /></div>
            </CardContent>
          </Card>

          {/* Group Settings */}
          <Card>
            <CardHeader><CardTitle>Group Settings</CardTitle><CardDescription>Configure default group parameters</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Default Group Slot Size</Label><Input type="number" value={settings.defaultGroupSlotSize} onChange={(e) => setSettings({ ...settings, defaultGroupSlotSize: parseInt(e.target.value) })} className="mt-1" /></div>
                <div><Label>Default Join Deadline (Days)</Label><Input type="number" value={settings.defaultJoinDeadlineDays} onChange={(e) => setSettings({ ...settings, defaultJoinDeadlineDays: parseInt(e.target.value) })} className="mt-1" /></div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded bg-gray-50">
                <div><Label className="text-sm">Auto-Approve Inquiries</Label><p className="text-xs text-gray-500 mt-1">Automatically approve inquiries without manual verification</p></div>
                <input type="checkbox" checked={settings.autoApproveInterests} onChange={(e) => setSettings({ ...settings, autoApproveInterests: e.target.checked })} className="w-5 h-5 cursor-pointer" />
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader><CardTitle>Email Configuration</CardTitle><CardDescription>Configure email service provider</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Mailgun API Key</Label><Input type="password" value={settings.mailgunApiKey} onChange={(e) => setSettings({ ...settings, mailgunApiKey: e.target.value })} className="mt-1" /><p className="text-xs text-gray-500 mt-2">Used for sending emails to users and admins</p></div>
              <div className="border rounded p-4 bg-gray-50 space-y-3">
                <h3 className="font-semibold text-sm">Test Email</h3>
                <div className="flex gap-2">
                  <Input placeholder="test@example.com" value={testEmailAddress} onChange={(e) => setTestEmailAddress(e.target.value)} />
                  <Button onClick={handleTestEmail} disabled={testEmailSending} className="gap-2">
                    {testEmailSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Send Test
                  </Button>
                </div>
              </div>
              <div className="border rounded p-4 bg-gray-50 space-y-3">
                <h3 className="font-semibold text-sm">Test SMS</h3>
                <div className="flex gap-2">
                  <Input placeholder="+91 98765 43210" value={testSmsPhone} onChange={(e) => setTestSmsPhone(e.target.value)} />
                  <Button onClick={handleTestSms} disabled={testSmsSending} className="gap-2">
                    {testSmsSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Send Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
  );
}
