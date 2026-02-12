'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type AuthStep = 'phone' | 'otp' | 'signup' | 'login' | 'forgotPassword';

export const UnifiedAuthFlow: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { sendOtp, verifyOtp, completeSignup, login, forgotPassword, resetPassword, isLoading, error, clearError } = useAuth();
  
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Login fields
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  React.useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleSendOtp = async () => {
    try {
      clearError();
      await sendOtp(phone);
      setOtpTimer(60);
      setStep('otp');
    } catch (err) {
      console.error('Send OTP failed:', err);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      clearError();
      const result = await verifyOtp(phone, otp);
      setIsNewUser(result.isNewUser);
      setStep(result.isNewUser ? 'signup' : 'login');
    } catch (err) {
      console.error('Verify OTP failed:', err);
    }
  };

  const handleCompleteSignup = async () => {
    try {
      clearError();
      await completeSignup(phone, {
        firstName,
        lastName,
        email,
        city,
        preferences,
      });
      onClose?.();
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  const handleLogin = async () => {
    try {
      clearError();
      await login(phone, password);
      onClose?.();
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleForgotPassword = async () => {
    try {
      clearError();
      await forgotPassword(phone);
      setOtpTimer(60);
      // Next step would be to verify OTP for password reset
    } catch (err) {
      console.error('Forgot password failed:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Phone Number Entry */}
      {step === 'phone' && (
        <Card>
          <CardHeader>
            <CardTitle>Login / Sign Up</CardTitle>
            <CardDescription>Enter your mobile number to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleSendOtp} disabled={!phone || isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP
            </Button>
            <p className="text-xs text-gray-500 text-center">
              We'll send a verification code to your phone
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 2: OTP Verification */}
      {step === 'otp' && (
        <Card>
          <CardHeader>
            <CardTitle>Verify OTP</CardTitle>
            <CardDescription>Enter the 6-digit code sent to {phone}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify OTP
            </Button>
            <div className="flex justify-between text-sm">
              <button
                onClick={() => setStep('phone')}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Change Number
              </button>
              <button
                onClick={handleSendOtp}
                disabled={otpTimer > 0 || isLoading}
                className="text-blue-600 hover:underline disabled:text-gray-400"
              >
                {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3a: New User Signup */}
      {step === 'signup' && isNewUser && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>A few more details to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="city" disabled={isLoading}>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Property Preferences</Label>
              <div className="space-y-2">
                {['1BHK', '2BHK', '3BHK', '4BHK'].map((pref) => (
                  <div key={pref} className="flex items-center">
                    <Checkbox
                      id={pref}
                      checked={preferences.includes(pref)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPreferences([...preferences, pref]);
                        } else {
                          setPreferences(preferences.filter((p) => p !== pref));
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Label htmlFor={pref} className="ml-2 font-normal cursor-pointer">
                      {pref}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-xs font-normal cursor-pointer">
                I agree to the Terms & Conditions and Privacy Policy
              </Label>
            </div>

            <Button
              onClick={handleCompleteSignup}
              disabled={!firstName || !lastName || !email || !city || !termsAccepted || isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3b: Existing User Login */}
      {step === 'login' && !isNewUser && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Password</CardTitle>
            <CardDescription>Welcome back to Let's Buy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button onClick={handleLogin} disabled={!password || isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>

            <button
              onClick={() => setStep('forgotPassword')}
              className="text-sm text-blue-600 hover:underline w-full text-center"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </CardContent>
        </Card>
      )}

      {/* Forgot Password */}
      {step === 'forgotPassword' && (
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>We'll send a code to your phone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Resetting for: {phone}</p>
            <div className="space-y-2">
              <Label htmlFor="resetPassword">New Password</Label>
              <Input
                id="resetPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleForgotPassword}
              disabled={!newPassword || isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>

            <button
              onClick={() => setStep('login')}
              className="text-sm text-blue-600 hover:underline w-full text-center"
              disabled={isLoading}
            >
              Back to Login
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
