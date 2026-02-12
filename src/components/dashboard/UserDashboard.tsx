'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, Download, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Your Groups Tab Component
const YourGroupsTab = () => {
  const mockGroups = [
    {
      id: '1',
      propertyName: 'Sky Heights Residency',
      configuration: '2BHK',
      status: 'Filling',
      membersJoined: 12,
      totalSlots: 20,
      joinDate: '2024-01-15',
      paymentStatus: 'Completed',
      whatsappLink: 'https://chat.whatsapp.com/xyz',
      position: 5,
    },
    {
      id: '2',
      propertyName: 'Green Park Towers',
      configuration: '3BHK',
      status: 'Open',
      membersJoined: 8,
      totalSlots: 25,
      joinDate: '2024-02-01',
      paymentStatus: 'Pending',
      whatsappLink: 'https://chat.whatsapp.com/abc',
      position: 3,
    },
  ];

  return (
    <div className="space-y-4">
      {mockGroups.map((group) => (
        <Card key={group.id}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{group.propertyName}</h3>
                <p className="text-sm text-gray-600">{group.configuration}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{group.status}</Badge>
                  <Badge variant={group.paymentStatus === 'Completed' ? 'default' : 'secondary'}>
                    {group.paymentStatus}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">{group.membersJoined}</span>/{group.totalSlots} members
                </div>
                <div className="text-sm">
                  Your Position: <span className="font-medium">#{group.position}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Joined: {new Date(group.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild>
                <a href={group.whatsappLink} target="_blank" rel="noopener noreferrer">
                  WhatsApp Group
                </a>
              </Button>
              <Button variant="outline" size="sm">View Details</Button>
              <Button variant="outline" size="sm">Contact Admin</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Your Payments Tab Component
const YourPaymentsTab = () => {
  const mockPayments = [
    {
      id: '1',
      propertyName: 'Sky Heights Residency',
      configuration: '2BHK',
      amount: 500000,
      paid: 500000,
      pending: 0,
      paymentDate: '2024-01-20',
      status: 'Completed',
      method: 'Bank Transfer',
      receiptUrl: '#',
    },
    {
      id: '2',
      propertyName: 'Green Park Towers',
      configuration: '3BHK',
      amount: 750000,
      paid: 0,
      pending: 750000,
      paymentDate: null,
      status: 'Pending',
      method: 'UPI',
      receiptUrl: null,
    },
  ];

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-4">
      {mockPayments.map((payment) => (
        <Card key={payment.id}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold">{payment.propertyName}</h3>
                <p className="text-sm text-gray-600">{payment.configuration}</p>
              </div>
              <div className="space-y-1">
                <div className="text-sm">
                  Total: <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="text-sm">
                  Paid: <span className="font-semibold text-green-600">{formatCurrency(payment.paid)}</span>
                </div>
                {payment.pending > 0 && (
                  <div className="text-sm">
                    Pending: <span className="font-semibold text-orange-600">{formatCurrency(payment.pending)}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between">
                <Badge className={payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                  {payment.status}
                </Badge>
                <p className="text-xs text-gray-500">{payment.method}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {payment.status === 'Pending' && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Pay Now
                </Button>
              )}
              {payment.receiptUrl && (
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
              )}
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Shortlisted Properties Tab Component
const ShortlistedTab = () => {
  const mockShortlisted = [
    {
      id: '1',
      name: 'Sky Heights Residency',
      location: 'Mumbai',
      priceRange: '50L - 80L',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: '2',
      name: 'Green Park Towers',
      location: 'Bangalore',
      priceRange: '45L - 75L',
      image: 'https://via.placeholder.com/300x200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockShortlisted.map((property) => (
        <Card key={property.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <img src={property.image || "/placeholder.svg"} alt={property.name} className="w-full h-40 object-cover rounded-t-lg" />
            <div className="p-4">
              <h3 className="font-semibold">{property.name}</h3>
              <p className="text-sm text-gray-600">{property.location}</p>
              <p className="text-sm font-semibold mt-2">{typeof property.priceRange === 'string' ? property.priceRange : ''}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Heart className="w-4 h-4 mr-2 fill-red-500 text-red-500" />
                  Remove
                </Button>
                <Button size="sm" className="flex-1">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Account Settings Tab Component
const SettingsTab = () => {
  const { user, changePassword, deleteAccount, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      alert('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert('Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteAccount();
      } catch (err) {
        alert('Failed to delete account');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <p className="text-lg">{user?.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <p className="text-lg">{user?.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <p className="text-lg">{user?.phone}</p>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="ml-2">Email Notifications</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="ml-2">SMS Notifications</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded" />
            <span className="ml-2">Push Notifications</span>
          </label>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={logout} className="w-full text-left bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            className="w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
          >
            Delete Account Permanently
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
            <p className="text-gray-600 mt-1">Manage your properties, groups, and payments</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">2</div>
              <p className="text-sm text-gray-600">Groups Joined</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">2</div>
              <p className="text-sm text-gray-600">Active Payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">5</div>
              <p className="text-sm text-gray-600">Shortlisted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">₹12.5L</div>
              <p className="text-sm text-gray-600">Total Invested</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="groups" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="groups">Your Groups</TabsTrigger>
            <TabsTrigger value="payments">Your Payments</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Your Groups</CardTitle>
                <CardDescription>Groups you've joined and are part of</CardDescription>
              </CardHeader>
              <CardContent>
                <YourGroupsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Your Payments</CardTitle>
                <CardDescription>Manage and track all your payments</CardDescription>
              </CardHeader>
              <CardContent>
                <YourPaymentsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortlisted">
            <Card>
              <CardHeader>
                <CardTitle>Shortlisted Properties</CardTitle>
                <CardDescription>Your saved properties</CardDescription>
              </CardHeader>
              <CardContent>
                <ShortlistedTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
