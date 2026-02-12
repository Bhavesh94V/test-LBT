'use client';

import React, { useState } from 'react';
import { X, Loader2, Mail, Lock, ArrowRight, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { adminAuthApi } from '@/services/adminApi';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminData: { email: string; role: string; token: string; refreshToken: string }) => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminAuthApi.login(email, password);
      const { admin, token, refreshToken } = result.data || result;

      // Store admin tokens separately
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminRefreshToken', refreshToken);
      localStorage.setItem('adminData', JSON.stringify({
        email: admin?.email || email,
        role: admin?.role || 'super_admin',
        firstName: admin?.firstName || 'Admin',
        lastName: admin?.lastName || 'User',
        _id: admin?._id,
      }));

      onLoginSuccess({
        email: admin?.email || email,
        role: admin?.role || 'super_admin',
        token,
        refreshToken,
      });

      toast({
        title: 'Admin Login Successful',
        description: `Welcome back, ${admin?.firstName || 'Admin'}!`,
      });

      // Reset form
      setEmail('');
      setPassword('');
      onClose();
    } catch (err: any) {
      const errorMsg = err?.message || err?.data?.message || 'Invalid credentials. Please try again.';
      setError(errorMsg);
      toast({
        title: 'Login Failed',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-stone-100">
            <div className="w-14 h-14 mx-auto rounded-xl bg-stone-900 flex items-center justify-center mb-4">
              <ShieldAlert className="text-[#D92228] w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Admin Login</h2>
            <p className="text-stone-500 mt-2 text-sm">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-stone-700 font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@letsbuy.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="h-12 pl-11 text-base border-stone-300 focus:border-stone-900 focus:ring-stone-900"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-stone-700 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="h-12 pl-11 pr-11 text-base border-stone-300 focus:border-stone-900 focus:ring-stone-900"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-stone-400 pt-2">
              Authorized personnel only. All access is logged.
            </p>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminAuthModal;
