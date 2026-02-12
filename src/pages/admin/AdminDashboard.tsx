'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminOTPAuthModal from '@/components/auth/AdminOTPAuthModal';
import { analyticsApi, inquiryApi } from '@/services/adminApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Package, Layers, Eye, User, Home, Loader2 } from 'lucide-react';

interface DashboardData {
  stats: { label: string; value: string; icon: any; color: string; change: string }[];
  visitorData: { date: string; visitors: number; sessions: number }[];
  topPages: { page: string; views: number; bounceRate: string }[];
  recentContacts: { id: string; name: string; phone: string; property: string; status: string }[];
}

const FALLBACK_STATS = [
  { label: 'Total Properties', value: '0', icon: Package, color: '#D92228', change: '--' },
  { label: 'Active Groups', value: '0', icon: Layers, color: '#0066CC', change: '--' },
  { label: 'Total Users', value: '0', icon: Users, color: '#00A86B', change: '--' },
  { label: 'Page Views', value: '0', icon: Eye, color: '#FF6B35', change: '--' },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(true);
  const [adminData, setAdminData] = useState<{ phone: string; role: 'super_admin' | 'admin' | 'manager' | 'support' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(FALLBACK_STATS);
  const [visitorData, setVisitorData] = useState<{ date: string; visitors: number; sessions: number }[]>([]);
  const [topPages, setTopPages] = useState<{ page: string; views: number; bounceRate: string }[]>([]);
  const [recentContacts, setRecentContacts] = useState<{ id: string; name: string; phone: string; property: string; status: string }[]>([]);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminData');
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
      setAuthModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!adminData) return;
    fetchDashboardData();
  }, [adminData]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, contactsRes] = await Promise.allSettled([
        analyticsApi.getDashboard(),
        inquiryApi.getAll({ limit: 4, sort: '-createdAt' }),
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value?.data) {
        const raw = dashRes.value.data;
        // API may return { stats: {...}, ... } or flat structure
        const d = raw.stats || raw;
        setDashboardStats([
          { label: 'Total Properties', value: String(d.totalProperties ?? 0), icon: Package, color: '#D92228', change: d.propertiesChange ?? '--' },
          { label: 'Active Groups', value: String(d.activeGroups ?? 0), icon: Layers, color: '#0066CC', change: d.groupsChange ?? '--' },
          { label: 'Total Users', value: String(d.totalUsers ?? 0), icon: Users, color: '#00A86B', change: d.usersChange ?? '--' },
          { label: 'Page Views', value: String(d.pageViews ?? 0), icon: Eye, color: '#FF6B35', change: d.pageViewsChange ?? '--' },
        ]);
        const visData = raw.visitorData || d.visitorData;
        const tPages = raw.topPages || d.topPages;
        if (visData) setVisitorData(visData);
        if (tPages) setTopPages(tPages);
      }

      if (contactsRes.status === 'fulfilled' && contactsRes.value?.data) {
        const contacts = Array.isArray(contactsRes.value.data) ? contactsRes.value.data : [];
        setRecentContacts(contacts.slice(0, 4).map((c: any) => ({
          id: c._id || c.id,
          name: c.userName || `${c.firstName || ''} ${c.lastName || ''}`.trim(),
          phone: c.phone || '',
          property: c.propertyName || c.propertyId || '',
          status: c.status || 'pending',
        })));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (data: { phone: string; role: 'super_admin' | 'admin' | 'manager' | 'support' }) => {
    setAdminData(data);
    localStorage.setItem('adminData', JSON.stringify(data));
    setAuthModalOpen(false);
  };

  if (authModalOpen || !adminData) {
    return <AdminOTPAuthModal isOpen={authModalOpen} onClose={() => {}} onLoginSuccess={handleAdminLogin} />;
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getStatusColor = (status: string) => {
    if (status === 'verified' || status === 'paid') return 'bg-green-100 text-green-700';
    if (status === 'payment_link_sent' || status === 'Payment Pending') return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div key={idx} variants={item} className="bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-stone-600 text-sm font-medium">{stat.label}</p>
                    {loading ? (
                      <div className="h-9 mt-2 flex items-center"><Loader2 className="animate-spin text-stone-400" size={20} /></div>
                    ) : (
                      <h3 className="text-3xl font-bold text-stone-900 mt-2">{stat.value}</h3>
                    )}
                    <p className="text-xs text-green-600 mt-2 font-medium">{stat.change} from last month</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visitors Chart */}
          <motion.div variants={item} className="lg:col-span-2 bg-white p-6 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-900">Visitor Analytics</h3>
            </div>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center"><Loader2 className="animate-spin text-stone-400" size={32} /></div>
            ) : visitorData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="date" stroke="#78716c" />
                  <YAxis stroke="#78716c" />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="visitors" stroke="#D92228" strokeWidth={2} dot={{ fill: '#D92228', r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="sessions" stroke="#0066CC" strokeWidth={2} dot={{ fill: '#0066CC', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-stone-400">No visitor data available yet</div>
            )}
          </motion.div>

          {/* Traffic Sources */}
          <motion.div variants={item} className="bg-white p-6 rounded-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Traffic Sources</h3>
            <div className="space-y-4">
              {[
                { source: 'Organic', percentage: 45, color: '#D92228' },
                { source: 'Direct', percentage: 30, color: '#0066CC' },
                { source: 'Social', percentage: 15, color: '#00A86B' },
                { source: 'Referral', percentage: 10, color: '#FF6B35' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-stone-700">{item.source}</span>
                    <span className="text-sm font-bold text-stone-900">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full transition-all duration-500" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <motion.div variants={item} className="bg-white p-6 rounded-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Top Pages</h3>
            {loading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-stone-400" size={24} /></div>
            ) : topPages.length > 0 ? (
              <div className="space-y-3">
                {topPages.map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-lg"><Home size={16} className="text-[#D92228]" /></div>
                      <div>
                        <p className="text-sm font-medium text-stone-900">{page.page}</p>
                        <p className="text-xs text-stone-500">{page.views} views</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-600">Bounce</p>
                      <p className="text-sm font-bold text-stone-900">{page.bounceRate}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-stone-400">No page data available</div>
            )}
          </motion.div>

          {/* Recent Contacts */}
          <motion.div variants={item} className="bg-white p-6 rounded-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Recent Contacts</h3>
            {loading ? (
              <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-stone-400" size={24} /></div>
            ) : recentContacts.length > 0 ? (
              <div className="space-y-3">
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-blue-50 rounded-lg shrink-0"><User size={16} className="text-[#0066CC]" /></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900">{contact.name}</p>
                        <p className="text-xs text-stone-500 truncate">{contact.property}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${getStatusColor(contact.status)}`}>
                      {contact.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-stone-400">No recent contacts</div>
            )}
          </motion.div>
        </div>
      </motion.div>
  );
};

export default AdminDashboard;
