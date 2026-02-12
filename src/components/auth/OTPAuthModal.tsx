'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Phone, Mail, MapPin, ArrowRight, User, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface OTPAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

type AuthMode = 'choose' | 'login-phone' | 'login-otp' | 'register' | 'register-otp';

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata', 'Chennai', 'Ahmedabad'];

const OTPAuthModal: React.FC<OTPAuthModalProps> = ({ isOpen, onClose, redirectTo = '/properties' }) => {
  const [mode, setMode] = useState<AuthMode>('choose');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    cityPreference: '',
  });

  const { register, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMode('choose');
      setPhone('');
      setOtp('');
      setRegisterData({ fullName: '', email: '', cityPreference: '' });
      setTimer(0);
    }
  }, [isOpen]);

  // --- LOGIN FLOW ---
  const handleLoginSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast({ title: 'Invalid Phone', description: 'Please enter a valid 10-digit phone number.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await sendOtp(phone);
      // Check if user exists (isNewUser flag from backend)
      if (result?.data?.isNewUser) {
        toast({ title: 'User Not Found', description: 'No account found with this number. Please register first.', variant: 'destructive' });
        setMode('register');
        setIsLoading(false);
        return;
      }
      setTimer(60);
      setMode('login-otp');
      toast({ title: 'OTP Sent', description: `OTP sent to +91 ${phone.slice(-4).padStart(10, '*')}` });
    } catch (error: any) {
      const msg = error?.message || error?.data?.message || 'Failed to send OTP';
      if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('not registered')) {
        toast({ title: 'User Not Found', description: 'No account with this number. Please register first.', variant: 'destructive' });
        setMode('register');
      } else {
        toast({ title: 'Error', description: msg, variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'OTP must be 6 digits.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(phone, otp);
      toast({ title: 'Welcome Back!', description: 'You have successfully logged in.' });
      onClose();
      navigate(redirectTo);
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Invalid OTP. Please try again.', variant: 'destructive' });
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  // --- REGISTER FLOW ---
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast({ title: 'Invalid Phone', description: 'Please enter a valid 10-digit phone number.', variant: 'destructive' });
      return;
    }
    if (!registerData.fullName.trim()) {
      toast({ title: 'Name Required', description: 'Please enter your full name.', variant: 'destructive' });
      return;
    }
    if (!registerData.email.trim() || !registerData.email.includes('@')) {
      toast({ title: 'Email Required', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      // First register the user
      await register({
        phone,
        fullName: registerData.fullName,
        email: registerData.email,
        preferredCity: registerData.cityPreference || undefined,
      });

      // Then send OTP for verification
      await sendOtp(phone);
      setTimer(60);
      setMode('register-otp');
      toast({ title: 'Registered & OTP Sent', description: 'Account created! Please verify with OTP.' });
    } catch (error: any) {
      const msg = error?.message || error?.data?.message || 'Registration failed';
      toast({ title: 'Registration Failed', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'OTP must be 6 digits.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(phone, otp);
      toast({ title: 'Account Verified!', description: 'Your account is now active. Welcome!' });
      onClose();
      navigate(redirectTo);
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Invalid OTP. Please try again.', variant: 'destructive' });
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    try {
      await sendOtp(phone);
      setTimer(60);
      toast({ title: 'OTP Resent', description: 'New OTP has been sent to your phone.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to resend OTP.', variant: 'destructive' });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-colors z-10">
            <X className="w-5 h-5 text-stone-600" />
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-stone-100">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#D92228] flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">LB</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">
              {mode === 'choose' && "Welcome to Let's Buy"}
              {mode === 'login-phone' && "Login with OTP"}
              {mode === 'login-otp' && "Enter OTP"}
              {mode === 'register' && "Create Account"}
              {mode === 'register-otp' && "Verify Your Phone"}
            </h2>
            <p className="text-stone-600 mt-2 text-sm">
              {mode === 'choose' && "Login or create a new account to get started"}
              {mode === 'login-phone' && "Enter your registered mobile number"}
              {mode === 'login-otp' && `We sent a 6-digit code to +91 ${phone}`}
              {mode === 'register' && "Fill in your details to register"}
              {mode === 'register-otp' && `Verify OTP sent to +91 ${phone}`}
            </p>
          </div>

          <div className="px-8 py-8">
            {/* CHOOSE MODE */}
            {mode === 'choose' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Button onClick={() => setMode('login-phone')} className="w-full h-12 bg-[#D92228] hover:bg-[#B01820] text-white font-semibold rounded-lg">
                  Login <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={() => setMode('register')} variant="outline" className="w-full h-12 border-stone-300 text-stone-700 hover:border-[#D92228] hover:text-[#D92228] font-semibold rounded-lg bg-transparent">
                  Create New Account <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* LOGIN - PHONE */}
            {mode === 'login-phone' && (
              <form onSubmit={handleLoginSendOTP}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-phone" className="text-stone-700 font-medium">Mobile Number</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-medium">+91</span>
                      <Input id="login-phone" type="tel" placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="h-12 pl-12 text-lg border-stone-300" maxLength={10} />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading || phone.length !== 10} className="w-full h-12 bg-[#D92228] hover:bg-[#B01820] text-white font-semibold rounded-lg">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                  <button type="button" onClick={() => setMode('choose')} className="w-full text-sm text-stone-500 hover:text-[#D92228] flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                </motion.div>
              </form>
            )}

            {/* LOGIN - OTP */}
            {mode === 'login-otp' && (
              <form onSubmit={handleLoginVerifyOTP}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-stone-700 font-medium">Enter OTP</Label>
                    <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                      <InputOTPGroup className="flex items-center justify-center gap-2">
                        {[0,1,2,3,4,5].map(i => (
                          <InputOTPSlot key={i} index={i} className="h-12 w-12 rounded-lg border-2 border-stone-300 bg-white text-lg font-semibold focus-visible:border-[#D92228] focus-visible:ring-2 focus-visible:ring-[#D92228]/20" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button type="submit" disabled={isLoading || otp.length !== 6} className="w-full h-12 bg-[#D92228] hover:bg-[#B01820] text-white font-semibold rounded-lg">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & Login <ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={() => { setMode('login-phone'); setOtp(''); }} className="text-sm text-stone-600 hover:text-[#D92228]">Change number</button>
                    {timer > 0 ? <span className="text-sm text-stone-500">Resend in {timer}s</span> : <button type="button" onClick={handleResendOTP} className="text-sm text-[#D92228] hover:underline font-medium">Resend OTP</button>}
                  </div>
                </motion.div>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-stone-700 font-medium flex items-center gap-2"><Phone size={16} /> Mobile Number</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-medium">+91</span>
                      <Input type="tel" placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="h-11 pl-12 border-stone-300" maxLength={10} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-700 font-medium flex items-center gap-2"><User size={16} /> Full Name</Label>
                    <Input type="text" placeholder="John Doe" value={registerData.fullName} onChange={(e) => setRegisterData(p => ({ ...p, fullName: e.target.value }))} className="h-11 border-stone-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-700 font-medium flex items-center gap-2"><Mail size={16} /> Email Address</Label>
                    <Input type="email" placeholder="john@example.com" value={registerData.email} onChange={(e) => setRegisterData(p => ({ ...p, email: e.target.value }))} className="h-11 border-stone-300" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-700 font-medium flex items-center gap-2"><MapPin size={16} /> City Preference</Label>
                    <select value={registerData.cityPreference} onChange={(e) => setRegisterData(p => ({ ...p, cityPreference: e.target.value }))} className="w-full h-11 px-3 border border-stone-300 rounded-md bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D92228]">
                      <option value="">Select your city (optional)</option>
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                  <Button type="submit" disabled={isLoading || phone.length !== 10 || !registerData.fullName || !registerData.email} className="w-full h-12 bg-[#D92228] hover:bg-[#B01820] text-white font-semibold rounded-lg mt-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Register & Send OTP <ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                  <button type="button" onClick={() => setMode('choose')} className="w-full text-sm text-stone-500 hover:text-[#D92228] flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                </motion.div>
              </form>
            )}

            {/* REGISTER - OTP VERIFY */}
            {mode === 'register-otp' && (
              <form onSubmit={handleRegisterVerifyOTP}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-stone-700 font-medium">Enter Verification OTP</Label>
                    <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                      <InputOTPGroup className="flex items-center justify-center gap-2">
                        {[0,1,2,3,4,5].map(i => (
                          <InputOTPSlot key={i} index={i} className="h-12 w-12 rounded-lg border-2 border-stone-300 bg-white text-lg font-semibold focus-visible:border-[#D92228] focus-visible:ring-2 focus-visible:ring-[#D92228]/20" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button type="submit" disabled={isLoading || otp.length !== 6} className="w-full h-12 bg-[#D92228] hover:bg-[#B01820] text-white font-semibold rounded-lg">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & Complete <ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={() => { setMode('register'); setOtp(''); }} className="text-sm text-stone-600 hover:text-[#D92228]">Back to form</button>
                    {timer > 0 ? <span className="text-sm text-stone-500">Resend in {timer}s</span> : <button type="button" onClick={handleResendOTP} className="text-sm text-[#D92228] hover:underline font-medium">Resend OTP</button>}
                  </div>
                </motion.div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OTPAuthModal;
