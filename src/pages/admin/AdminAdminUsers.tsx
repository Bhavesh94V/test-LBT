'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminUserApi } from '@/services/adminApi';
import { Plus, Edit, Trash2, X, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminUser {
  _id?: string;
  id?: number;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'manager' | 'support';
  status: 'active' | 'inactive';
  joinedAt?: string;
  createdAt?: string;
}

const AdminAdminUsers: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'admin' as const });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await adminUserApi.getAll();
      setAdmins(response.data || []);
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', role: 'admin' });
    setShowModal(true);
  };

  const handleEditAdmin = (admin: AdminUser) => {
    const adminId = admin._id || String(admin.id);
    setFormData({ name: admin.name, email: admin.email, phone: admin.phone || '', role: admin.role });
    setEditingId(adminId);
    setShowModal(true);
  };

  const handleSaveAdmin = async () => {
    try {
      if (editingId) {
        const response = await adminUserApi.update(editingId, formData as any);
        setAdmins(admins.map(a => (a._id || String(a.id)) === editingId ? { ...a, ...formData, ...(response.data || {}) } : a));
      } else {
        const response = await adminUserApi.create(formData);
        const newAdmin = response.data || { ...formData, _id: Date.now().toString(), status: 'active', createdAt: new Date().toISOString() };
        setAdmins([...admins, newAdmin]);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save admin:', err);
      // Fallback local update
      if (editingId) {
        setAdmins(admins.map(a => (a._id || String(a.id)) === editingId ? { ...a, ...formData } : a));
      } else {
        setAdmins([...admins, { ...formData, _id: Date.now().toString(), status: 'active', createdAt: new Date().toISOString() }]);
      }
      setShowModal(false);
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    const adminId = admin._id || String(admin.id);
    if (!confirm('Are you sure you want to delete this admin?')) return;
    try {
      await adminUserApi.delete(adminId);
      setAdmins(admins.filter(a => (a._id || String(a.id)) !== adminId));
    } catch (err) {
      console.error('Failed to delete admin:', err);
      setAdmins(admins.filter(a => (a._id || String(a.id)) !== adminId));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-700';
      case 'admin': return 'bg-orange-100 text-orange-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Admin Users</h1>
            <p className="text-stone-600 text-sm mt-1">Manage admin users and roles</p>
          </div>
          <Button onClick={handleAddAdmin} className="bg-[#D92228] hover:bg-[#B01820] text-white gap-2"><Plus size={18} /> Add Admin</Button>
        </div>

        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-stone-400" size={32} /></div>
          ) : admins.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-stone-400">No admin users found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-stone-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {admins.map((admin) => {
                  const adminKey = admin._id || String(admin.id);
                  return (
                    <motion.tr key={adminKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4"><p className="font-medium text-stone-900 flex items-center gap-2"><Shield size={16} className="text-[#D92228]" />{admin.name}</p></td>
                      <td className="px-6 py-4 text-sm text-stone-700">{admin.email}</td>
                      <td className="px-6 py-4"><span className={`text-xs font-medium px-3 py-1 rounded-full ${getRoleColor(admin.role)}`}>{admin.role.replace('_', ' ').toUpperCase()}</span></td>
                      <td className="px-6 py-4"><span className={`text-xs font-medium px-3 py-1 rounded-full ${admin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{(admin.status || 'active').toUpperCase()}</span></td>
                      <td className="px-6 py-4 text-sm text-stone-700">{admin.joinedAt || admin.createdAt ? new Date(admin.joinedAt || admin.createdAt || '').toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEditAdmin(admin)} className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-orange-600"><Edit size={16} /></button>
                          {admin.role !== 'super_admin' && (<button onClick={() => handleDeleteAdmin(admin)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"><Trash2 size={16} /></button>)}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-stone-900">{editingId ? 'Edit Admin' : 'Add Admin User'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-stone-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Admin name" /></div>
                <div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="admin@letsbuy.com" /></div>
                <div><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" /></div>
                <div>
                  <Label>Role</Label>
                  <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })} className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D92228]">
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="support">Support</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-stone-200">
                <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1 bg-transparent">Cancel</Button>
                <Button onClick={handleSaveAdmin} className="flex-1 bg-[#D92228] hover:bg-[#B01820] text-white">Save Admin</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminAdminUsers;
