'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyticsApi } from '@/services/adminApi';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Eye, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FALLBACK_PAGEVIEWS = [
  { date: '01 Jan', views: 0, users: 0 },
];

const AdminAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Real-Time Visitors', value: '0', status: 'Live now', icon: Users, color: '#D92228' },
    { label: '7-Day Visitors', value: '0', status: 'Last 7 days', icon: Users, color: '#0066CC' },
    { label: 'Page Views (30d)', value: '0', status: 'Total views', icon: Eye, color: '#00A86B' },
    { label: 'Avg Session Duration', value: '--', status: 'Overall average', icon: TrendingUp, color: '#FF6B35' },
  ]);
  const [pageviewsData, setPageviewsData] = useState(FALLBACK_PAGEVIEWS);
  const [trafficSources, setTrafficSources] = useState([
    { name: 'Direct', value: 30, fill: '#0066CC' },
    { name: 'Organic', value: 45, fill: '#D92228' },
    { name: 'Social', value: 15, fill: '#00A86B' },
    { name: 'Referral', value: 10, fill: '#FF6B35' },
  ]);
  const [topCountries, setTopCountries] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [dashRes, revenueRes, usersRes, propsRes] = await Promise.allSettled([
        analyticsApi.getDashboard(),
        analyticsApi.getRevenue({ period: dateRange }),
        analyticsApi.getUsers({ period: dateRange }),
        analyticsApi.getProperties({ period: dateRange }),
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value?.data) {
        const d = dashRes.value.data;
        setStats([
          { label: 'Real-Time Visitors', value: String(d.realTimeVisitors ?? 0), status: 'Live now', icon: Users, color: '#D92228' },
          { label: '7-Day Visitors', value: String(d.weeklyVisitors ?? 0), status: 'Last 7 days', icon: Users, color: '#0066CC' },
          { label: 'Page Views (30d)', value: String(d.monthlyPageViews ?? d.pageViews ?? 0), status: 'Total views', icon: Eye, color: '#00A86B' },
          { label: 'Avg Session Duration', value: d.avgSessionDuration ?? '--', status: 'Overall average', icon: TrendingUp, color: '#FF6B35' },
        ]);
        if (d.pageviewsData) setPageviewsData(d.pageviewsData);
        if (d.trafficSources) setTrafficSources(d.trafficSources);
        if (d.topCountries) setTopCountries(d.topCountries);
        if (d.topPages) setTopPages(d.topPages);
        if (d.conversionFunnel) setConversionFunnel(d.conversionFunnel);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await analyticsApi.getRevenue({ period: dateRange, format: 'csv' });
      if (blob) {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `analytics-${dateRange}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Analytics</h1>
            <p className="text-stone-600 mt-1">Real-time website analytics and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-medium">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button className="gap-2 bg-stone-900 hover:bg-stone-800 text-white" onClick={handleExport}><Download size={16} /> Export</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div key={idx} variants={item} className="bg-white p-6 rounded-xl border border-stone-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-stone-600 text-sm font-medium">{stat.label}</p>
                    {loading ? (
                      <div className="h-9 mt-2 flex items-center"><Loader2 className="animate-spin text-stone-400" size={20} /></div>
                    ) : (
                      <h3 className="text-3xl font-bold text-stone-900 mt-2">{stat.value}</h3>
                    )}
                    <p className="text-xs text-stone-500 mt-2">{stat.status}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}><Icon size={24} style={{ color: stat.color }} /></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2 bg-white p-6 rounded-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">Pageviews Trend</h3>
            <p className="text-sm text-stone-600 mt-1">Daily page progression analytics</p>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center"><Loader2 className="animate-spin text-stone-400" size={32} /></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={pageviewsData}>
                  <defs><linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D92228" stopOpacity={0.3} /><stop offset="95%" stopColor="#D92228" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="date" stroke="#78716c" fontSize={12} />
                  <YAxis stroke="#78716c" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#D92228" fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div variants={item} className="bg-white p-6 rounded-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Traffic Sources</h3>
            {loading ? (
              <div className="h-[250px] flex items-center justify-center"><Loader2 className="animate-spin text-stone-400" size={24} /></div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {trafficSources.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="mt-4 space-y-2">
              {trafficSources.map((source, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.fill }} />
                    <span className="text-stone-700">{source.name}</span>
                  </div>
                  <span className="font-bold text-stone-900">{source.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {conversionFunnel.length > 0 && (
          <motion.div variants={item} className="bg-white p-6 rounded-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Conversion Funnel</h3>
            <div className="space-y-3">
              {conversionFunnel.map((step: any, idx: number) => {
                const width = conversionFunnel[0]?.users ? (step.users / conversionFunnel[0].users) * 100 : 0;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-stone-900">{step.step}</span>
                      <span className="text-sm text-stone-600">{step.users?.toLocaleString()} users - {step.conversionRate}</span>
                    </div>
                    <div className="w-full h-8 bg-stone-100 rounded-lg overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#D92228] to-[#B01820] flex items-center justify-end pr-3 transition-all" style={{ width: `${width}%` }}>
                        {width > 15 && <span className="text-xs font-bold text-white">{width.toFixed(0)}%</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {topCountries.length > 0 && (
          <motion.div variants={item} className="bg-white p-6 rounded-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Top Countries</h3>
            <div className="space-y-4">
              {topCountries.map((country: any, idx: number) => (
                <div key={idx} className="pb-4 border-b border-stone-100 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-stone-900">{country.country}</span>
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">{country.users?.toLocaleString()} users</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span>{country.sessions?.toLocaleString()} sessions</span>
                    <span>Bounce: {country.bounceRate}</span>
                    <span>Avg: {country.avgDuration}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {topPages.length > 0 && (
          <motion.div variants={item} className="bg-white p-6 rounded-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Top Pages</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 font-semibold text-stone-700">Page</th>
                    <th className="text-right py-3 px-4 font-semibold text-stone-700">Views</th>
                    <th className="text-right py-3 px-4 font-semibold text-stone-700">Bounce Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((page: any, idx: number) => (
                    <tr key={idx} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-stone-900">{page.page}</td>
                      <td className="text-right py-3 px-4 text-stone-600">{page.views?.toLocaleString()}</td>
                      <td className="text-right py-3 px-4 text-stone-600">{page.bounceRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
  );
};

export default AdminAnalytics;
