'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationApi } from '@/services/adminApi';
import { Trash2, CheckCircle, Loader2, Plus, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Notification {
  _id?: string;
  id?: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendForm, setSendForm] = useState({ title: '', message: '', type: 'info' as const, targetUserIds: '' });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getAll();
      setNotifications(response.data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string | number) => {
    const notifId = String(id);
    try {
      // Use the notification API to mark as read (via main apiService if needed)
      setNotifications(notifications.map(n => (n._id || n.id) === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDelete = async (id: string | number) => {
    const notifId = String(id);
    try {
      await notificationApi.delete(notifId);
      setNotifications(notifications.filter(n => (n._id || n.id) !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setNotifications(notifications.filter(n => (n._id || n.id) !== id));
    }
  };

  const handleSendNotification = async () => {
    try {
      const payload: any = {
        title: sendForm.title,
        message: sendForm.message,
        type: sendForm.type,
      };
      if (sendForm.targetUserIds.trim()) {
        payload.userIds = sendForm.targetUserIds.split(',').map(id => id.trim());
      }
      await notificationApi.send(payload);
      setShowSendModal(false);
      setSendForm({ title: '', message: '', type: 'info', targetUserIds: '' });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-400';
      case 'error': return 'text-red-600 bg-red-50 border-red-400';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-400';
      default: return 'text-blue-600 bg-blue-50 border-blue-400';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Notifications</h1>
            <p className="text-stone-600 text-sm mt-1">Manage system notifications</p>
          </div>
          <Button onClick={() => setShowSendModal(true)} className="gap-2 bg-[#D92228] hover:bg-[#B01820] text-white">
            <Send size={16} /> Send Notification
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-stone-400" size={32} /></div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const notifKey = notif._id || notif.id;
              return (
                <motion.div
                  key={notifKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border-l-4 ${notif.isRead ? 'bg-stone-50 border-stone-200' : getTypeColor(notif.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-900">{notif.title}</h3>
                      <p className="text-sm text-stone-700 mt-1">{notif.message}</p>
                      <p className="text-xs text-stone-500 mt-2">{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notif.isRead && (
                        <button onClick={() => handleMarkAsRead(notifKey!)} className="p-2 hover:bg-white rounded-lg transition-colors" title="Mark as Read">
                          <CheckCircle size={20} className="text-green-600" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(notifKey!)} className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600" title="Delete">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      <AnimatePresence>
        {showSendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSendModal(false)} className="absolute inset-0 bg-black/50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-stone-900">Send Notification</h2>
                <button onClick={() => setShowSendModal(false)} className="p-2 hover:bg-stone-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div><Label>Title</Label><Input value={sendForm.title} onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })} placeholder="Notification title" className="mt-1" /></div>
                <div><Label>Message</Label><Textarea value={sendForm.message} onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })} placeholder="Notification message..." className="mt-1" /></div>
                <div>
                  <Label>Type</Label>
                  <select value={sendForm.type} onChange={(e) => setSendForm({ ...sendForm, type: e.target.value as any })} className="w-full px-3 py-2 mt-1 border border-stone-300 rounded-md bg-white text-sm">
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div><Label>Target User IDs (comma-separated, leave empty for all)</Label><Input value={sendForm.targetUserIds} onChange={(e) => setSendForm({ ...sendForm, targetUserIds: e.target.value })} placeholder="user1, user2" className="mt-1" /></div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-stone-200">
                <Button onClick={() => setShowSendModal(false)} variant="outline" className="flex-1 bg-transparent">Cancel</Button>
                <Button onClick={handleSendNotification} className="flex-1 bg-[#D92228] hover:bg-[#B01820] text-white">Send</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminNotifications;
