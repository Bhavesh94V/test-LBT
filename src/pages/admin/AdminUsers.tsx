'use client';

import React, { useState, useEffect } from 'react';
import { userApi } from '@/services/adminApi';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Eye, Edit, Ban, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { User } from '@/types/index';

interface UserWithGroups extends User {
  groupsJoined: number;
  totalPayments: number;
  suspendedReason?: string;
}

function UserDetailsModal({ user }: { user: UserWithGroups }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent"><Eye className="h-4 w-4" />View</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>User account details and history</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs font-semibold text-gray-500">First Name</Label><p className="text-sm font-medium mt-1">{user.firstName}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Last Name</Label><p className="text-sm font-medium mt-1">{user.lastName}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Email</Label><p className="text-sm mt-1">{user.email}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Phone</Label><p className="text-sm mt-1">{user.phone}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Role</Label><p className="text-sm mt-1 capitalize">{user.role}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Status</Label><div className="mt-1"><Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{user.status.toUpperCase()}</Badge></div></div>
            <div><Label className="text-xs font-semibold text-gray-500">Joined Date</Label><p className="text-sm mt-1">{new Date(user.joinedDate).toLocaleDateString()}</p></div>
          </div>
          <div className="bg-gray-50 rounded p-4 space-y-2">
            <Label className="text-xs font-semibold text-gray-700">Activity Summary</Label>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-600">Groups Joined</p><p className="text-lg font-bold text-gray-900">{user.groupsJoined}</p></div>
              <div><p className="text-xs text-gray-600">Total Payments</p><p className="text-lg font-bold text-gray-900">&#8377;{user.totalPayments?.toLocaleString() || 0}</p></div>
            </div>
          </div>
          {user.status === 'suspended' && user.suspendedReason && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="flex items-center gap-2 mb-2"><AlertCircle className="h-4 w-4 text-red-600" /><span className="font-semibold text-sm text-red-900">Suspended Account</span></div>
              <p className="text-sm text-red-800">{user.suspendedReason}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditUserModal({ user, onSave }: { user: UserWithGroups; onSave: (updatedUser: UserWithGroups) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(user);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent"><Edit className="h-4 w-4" />Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit User</DialogTitle><DialogDescription>Update user information</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div><Label>First Name</Label><Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="mt-1" /></div>
            <div><Label>Last Name</Label><Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="mt-1" /></div>
          </div>
          <div><Label>Email</Label><Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1" /></div>
          <div><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={() => { onSave(formData); setIsOpen(false); }}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SuspendUserModal({ user, onSuspend }: { user: UserWithGroups; onSuspend: (reason: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  if (user.status === 'suspended') return null;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button size="sm" variant="destructive" className="gap-2"><Ban className="h-4 w-4" />Suspend</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Suspend User Account</DialogTitle><DialogDescription>This will suspend the account of {user.firstName} {user.lastName}</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div><Label>Suspension Reason</Label><Textarea placeholder="Provide a reason for suspension..." value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2" /></div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent">Cancel</Button>
            <Button variant="destructive" onClick={() => { onSuspend(reason); setIsOpen(false); setReason(''); }}>Suspend Account</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UnsuspendUserModal({ user, onUnsuspend }: { user: UserWithGroups; onUnsuspend: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  if (user.status !== 'suspended') return null;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline" className="gap-2 bg-transparent"><CheckCircle className="h-4 w-4" />Reactivate</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Reactivate User Account</DialogTitle><DialogDescription>Reactivate the account of {user.firstName} {user.lastName}</DialogDescription></DialogHeader>
        {user.suspendedReason && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3"><p className="text-sm text-yellow-800">This user was suspended for: {user.suspendedReason}</p></div>
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-transparent">Cancel</Button>
          <Button onClick={() => { onUnsuspend(); setIsOpen(false); }}>Reactivate Account</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithGroups[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getAll();
      setUsers(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditUser = async (updatedUser: UserWithGroups) => {
    try {
      const response = await userApi.updateUser(updatedUser._id, updatedUser);
      setUsers(users.map((u) => (u._id === updatedUser._id ? { ...updatedUser, ...(response.data || {}) } : u)));
    } catch (err: any) {
      console.error('Failed to update user:', err);
      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
    }
  };

  const handleSuspendUser = async (userId: string, reason: string) => {
    try {
      await userApi.suspendUser(userId, { suspendedReason: reason });
      setUsers(users.map((u) => u._id === userId ? { ...u, status: 'suspended' as const, suspendedReason: reason } : u));
    } catch (err: any) {
      console.error('Failed to suspend user:', err);
      setUsers(users.map((u) => u._id === userId ? { ...u, status: 'suspended' as const, suspendedReason: reason } : u));
    }
  };

  const handleUnsuspendUser = async (userId: string) => {
    try {
      await userApi.activateUser(userId);
      setUsers(users.map((u) => u._id === userId ? { ...u, status: 'active' as const, suspendedReason: undefined } : u));
    } catch (err: any) {
      console.error('Failed to activate user:', err);
      setUsers(users.map((u) => u._id === userId ? { ...u, status: 'active' as const, suspendedReason: undefined } : u));
    }
  };

  const activeUsers = users.filter((u) => u.status === 'active').length;
  const suspendedUsers = users.filter((u) => u.status === 'suspended').length;

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-gray-600">Manage and monitor all registered users</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{activeUsers}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Suspended</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{suspendedUsers}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Users List</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-stone-400" size={32} /></div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-stone-400">No users found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs text-gray-700">Name</TableHead>
                    <TableHead className="text-xs text-gray-700">Email</TableHead>
                    <TableHead className="text-xs text-gray-700">Phone</TableHead>
                    <TableHead className="text-xs text-gray-700">Status</TableHead>
                    <TableHead className="text-xs text-gray-700">Joined Date</TableHead>
                    <TableHead className="text-xs text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell><Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{user.status.toUpperCase()}</Badge></TableCell>
                      <TableCell className="text-xs text-gray-500">{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <UserDetailsModal user={user} />
                          <EditUserModal user={user} onSave={handleEditUser} />
                          {user.status === 'active' ? (
                            <SuspendUserModal user={user} onSuspend={(reason) => handleSuspendUser(user._id, reason)} />
                          ) : (
                            <UnsuspendUserModal user={user} onUnsuspend={() => handleUnsuspendUser(user._id)} />
                          )}
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
