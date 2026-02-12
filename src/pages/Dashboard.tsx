'use client';

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardGroups from '@/components/dashboard/DashboardGroups';
import DashboardPayments from '@/components/dashboard/DashboardPayments';
import DashboardShortlist from '@/components/dashboard/DashboardShortlist';

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'profile';
  const { user, isAuthenticated, updateProfile, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';

  const [formData, setFormData] = useState({
    name: fullName,
    email: user?.email || '',
    photo: null as string | null,
  });

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Please Login</h2>
          <p className="text-stone-500 mb-6">You need to login to access your dashboard.</p>
          <Button onClick={() => navigate('/')} className="bg-[#D92228] hover:bg-[#B01820] text-white">
            Go to Home
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const [firstName, ...lastParts] = formData.name.split(' ');
      await updateProfile({
        firstName: firstName || '',
        lastName: lastParts.join(' ') || '',
        email: formData.email,
      });
      toast({ title: 'Profile Updated', description: 'Your profile has been saved.' });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to update profile.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    switch (tab) {
      case 'groups':
        return <DashboardGroups />;
      case 'payments':
        return <DashboardPayments />;
      case 'shortlist':
        return <DashboardShortlist />;
      default:
        return <ProfileContent />;
    }
  };

  const initials = fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const ProfileContent = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Profile</h2>
          <p className="text-stone-500">Update your personal details, contact info, and preferences.</p>
        </div>
      </div>

      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-[#D92228] to-[#FF6B6B] rounded-3xl p-8 mb-8 relative overflow-hidden min-h-48 flex items-end">
        <div className="absolute -top-8 -left-8 w-40 h-40 bg-white rounded-full opacity-20" />
        <div className="flex items-end gap-6 relative z-10">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <div className="w-32 h-32 rounded-full bg-stone-800 flex items-center justify-center text-white text-5xl font-bold overflow-hidden">
              {formData.photo ? (
                <img src={formData.photo || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials || 'U'
              )}
            </div>
          </div>
          {isEditing && (
            <label className="absolute bottom-4 right-8 bg-white text-stone-700 p-3 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors shadow-lg">
              <Camera className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-stone-900">{fullName}</h3>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="bg-[#D92228] hover:bg-[#B01820] text-white">
              Edit
            </Button>
          )}
        </div>

        <div className="border-t border-stone-200 pt-6">
          <h4 className="text-base font-semibold text-stone-900 mb-6">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-stone-700 mb-2 block">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} className="bg-white border-stone-300" placeholder="Enter your full name" />
            </div>
            <div>
              <Label className="text-sm font-medium text-stone-700 mb-2 block">Phone Number</Label>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white border border-stone-300 text-stone-600">
                <span>{user.phone || 'N/A'}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-stone-700 mb-2 block">Email Address</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className="bg-white border-stone-300" placeholder="your@email.com" />
            </div>
          </div>
          {user.preferredCity && (
            <div className="mt-6">
              <Label className="text-sm font-medium text-stone-700 mb-2 block">Preferred City</Label>
              <div className="px-4 py-2.5 rounded-lg bg-white border border-stone-300 text-stone-600 inline-block">{user.preferredCity}</div>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-8">
            <Button onClick={handleSave} disabled={isSaving} className="bg-[#D92228] hover:bg-[#B01820] text-white">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
            <Button onClick={() => { setIsEditing(false); setFormData({ name: fullName, email: user.email || '', photo: null }); }} variant="outline" className="border-stone-300 bg-transparent">
              Cancel
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
};

export default Dashboard;
