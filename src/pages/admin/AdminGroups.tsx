'use client';

import React, { useState, useEffect } from 'react';
import { groupApi } from '@/services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, Lock, Unlock, Eye, Link as LinkIcon, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BuyingGroup } from '@/types/index';

interface GroupWithMembers extends BuyingGroup {
  membersList?: Array<{ userName: string; email: string; phone: string; configuration: string; paymentStatus: string }>;
}

function GroupDetailsModal({ group }: { group: GroupWithMembers }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm" className="gap-2 bg-transparent"><Eye className="h-4 w-4" />Details</Button></DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Group Details</DialogTitle><DialogDescription>Complete group information</DialogDescription></DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs font-semibold text-gray-500">Group Name</Label><p className="text-sm font-medium mt-1">{group.groupName}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Status</Label><div className="mt-1"><Badge className={group.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>{group.status.toUpperCase()}</Badge></div></div>
            <div><Label className="text-xs font-semibold text-gray-500">Slot Price</Label><p className="text-sm font-bold mt-1">&#8377;{group.slotPrice?.toLocaleString()}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Members / Total</Label><p className="text-sm font-medium mt-1">{group.membersJoined}/{group.totalSlots}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Join Deadline</Label><p className="text-sm mt-1">{new Date(group.joinDeadline).toLocaleDateString()}</p></div>
            <div><Label className="text-xs font-semibold text-gray-500">Locked</Label><p className="text-sm mt-1">{group.locked ? 'Yes' : 'No'}</p></div>
          </div>
          {group.whatsappLink && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <Label className="text-xs font-semibold text-green-900">WhatsApp Group</Label>
              <p className="text-xs text-green-800 mt-1">{group.whatsappGroupName}</p>
              <a href={group.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs mt-2 inline-block hover:underline">Open WhatsApp Group</a>
            </div>
          )}
          {group.membersList && group.membersList.length > 0 && (
            <div>
              <Label className="text-xs font-semibold text-gray-500">Members</Label>
              <div className="mt-2 space-y-2">
                {group.membersList.map((member, idx) => (
                  <div key={idx} className="border rounded p-2 text-sm">
                    <p className="font-medium">{member.userName}</p>
                    <p className="text-xs text-gray-600">{member.email} - {member.phone}</p>
                    <p className="text-xs text-gray-600">{member.configuration} - Payment: {member.paymentStatus}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminGroups() {
  const [groups, setGroups] = useState<GroupWithMembers[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ groupName: '', propertyId: '', totalSlots: 10, slotPrice: 50000, joinDeadline: '' });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await groupApi.getAll();
      setGroups(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching groups:', err);
      setError(err.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || group.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleLockGroup = async (groupId: string) => {
    try {
      await groupApi.lockGroup(groupId);
      setGroups(groups.map((g) => g._id === groupId ? { ...g, locked: true } : g));
    } catch (err: any) {
      console.error('Failed to lock group:', err);
      setGroups(groups.map((g) => g._id === groupId ? { ...g, locked: true } : g));
    }
  };

  const handleUnlockGroup = async (groupId: string) => {
    try {
      await groupApi.unlockGroup(groupId);
      setGroups(groups.map((g) => g._id === groupId ? { ...g, locked: false } : g));
    } catch (err: any) {
      console.error('Failed to unlock group:', err);
      setGroups(groups.map((g) => g._id === groupId ? { ...g, locked: false } : g));
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await groupApi.create(createForm as any);
      setGroups([...groups, response.data || { ...createForm, _id: Date.now().toString(), status: 'open', locked: false, membersJoined: 0, availableSlots: createForm.totalSlots, members: [], membersList: [] } as any]);
      setShowCreateModal(false);
      setCreateForm({ groupName: '', propertyId: '', totalSlots: 10, slotPrice: 50000, joinDeadline: '' });
    } catch (err: any) {
      console.error('Failed to create group:', err);
    }
  };

  const totalSlots = groups.reduce((sum, g) => sum + g.totalSlots, 0);
  const filledSlots = groups.reduce((sum, g) => sum + g.membersJoined, 0);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Groups Management</h1>
            <p className="text-gray-600">Manage buyer groups and slots</p>
          </div>
          <Button className="gap-2" onClick={() => setShowCreateModal(true)}><Plus className="h-4 w-4" />Create Group</Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Groups</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{groups.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Open Groups</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{groups.filter((g) => g.status === 'open').length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Filled Slots</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{filledSlots}/{totalSlots}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Locked Groups</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{groups.filter((g) => g.locked).length}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Groups List</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <Input placeholder="Search groups..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-stone-300 rounded-lg bg-white text-sm">
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="full">Full</option>
              </select>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-stone-400" size={32} /></div>
            ) : filteredGroups.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-stone-400">No groups found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group Name</TableHead><TableHead>Members</TableHead><TableHead>Status</TableHead><TableHead>Locked</TableHead><TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups.map((group) => (
                      <TableRow key={group._id}>
                        <TableCell className="font-medium">{group.groupName}</TableCell>
                        <TableCell>{group.membersJoined}/{group.totalSlots}</TableCell>
                        <TableCell><Badge className={group.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>{group.status.toUpperCase()}</Badge></TableCell>
                        <TableCell><Badge className={group.locked ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>{group.locked ? 'Locked' : 'Open'}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <GroupDetailsModal group={group} />
                            {group.whatsappLink && (<a href={group.whatsappLink} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline" className="gap-2 bg-transparent"><LinkIcon className="h-4 w-4" />WhatsApp</Button></a>)}
                            {group.locked ? (
                              <Button size="sm" variant="outline" className="gap-2 bg-transparent" onClick={() => handleUnlockGroup(group._id!)}><Unlock className="h-4 w-4" />Unlock</Button>
                            ) : (
                              <Button size="sm" variant="outline" className="gap-2 bg-transparent" onClick={() => handleLockGroup(group._id!)}><Lock className="h-4 w-4" />Lock</Button>
                            )}
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

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-black/50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-stone-900">Create New Group</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-stone-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div><Label>Group Name</Label><Input value={createForm.groupName} onChange={(e) => setCreateForm({ ...createForm, groupName: e.target.value })} placeholder="e.g., Group A - Aristo Sky" className="mt-1" /></div>
                <div><Label>Property ID</Label><Input value={createForm.propertyId} onChange={(e) => setCreateForm({ ...createForm, propertyId: e.target.value })} placeholder="Property ID" className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Total Slots</Label><Input type="number" value={createForm.totalSlots} onChange={(e) => setCreateForm({ ...createForm, totalSlots: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
                  <div><Label>Slot Price</Label><Input type="number" value={createForm.slotPrice} onChange={(e) => setCreateForm({ ...createForm, slotPrice: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
                </div>
                <div><Label>Join Deadline</Label><Input type="date" value={createForm.joinDeadline} onChange={(e) => setCreateForm({ ...createForm, joinDeadline: e.target.value })} className="mt-1" /></div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-stone-200">
                <Button onClick={() => setShowCreateModal(false)} variant="outline" className="flex-1 bg-transparent">Cancel</Button>
                <Button onClick={handleCreateGroup} className="flex-1 bg-[#D92228] hover:bg-[#B01820] text-white">Create Group</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
