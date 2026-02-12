'use client';

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, LogOut, BarChart3, Package, Users, Settings,
  Bell, Home, Layers, MessageSquare, CreditCard, ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminAuthModal from '@/components/auth/AdminOTPAuthModal';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminMenuItems = [
  { label: 'Dashboard', icon: Home, href: '/admin' },
  { label: 'Properties', icon: Package, href: '/admin/properties' },
  { label: 'Groups', icon: Layers, href: '/admin/groups' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Contacts', icon: MessageSquare, href: '/admin/contacts' },
  { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { label: 'Admin Users', icon: ShieldCheck, href: '/admin/admin-users' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminData, setAdminData] = useState<{ email: string; role: string; firstName?: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if admin is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminData');
    if (token && storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin);
        setAdminData(parsed);
        setIsAdminAuthenticated(true);
      } catch {
        // Invalid data, show login
        setShowLoginModal(true);
      }
    } else {
      setShowLoginModal(true);
    }
  }, []);

  const handleLoginSuccess = (data: { email: string; role: string; token: string; refreshToken: string }) => {
    setIsAdminAuthenticated(true);
    setShowLoginModal(false);
    const stored = localStorage.getItem('adminData');
    if (stored) {
      try {
        setAdminData(JSON.parse(stored));
      } catch {
        setAdminData({ email: data.email, role: data.role });
      }
    } else {
      setAdminData({ email: data.email, role: data.role });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminData');
    setIsAdminAuthenticated(false);
    setAdminData(null);
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  // Show login modal if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <AdminAuthModal
          isOpen={true}
          onClose={() => navigate('/')}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-50">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex flex-col bg-stone-900 text-white fixed left-0 top-0 h-screen border-r border-stone-800 overflow-y-auto z-40"
      >
        {/* Logo */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <motion.div
            animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <h1 className="text-xl font-bold text-[#D92228]">{"Let's Buy"}</h1>
            <p className="text-xs text-stone-400 mt-1">Admin Panel</p>
          </motion.div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-[#D92228] text-white'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <motion.span
                  animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 space-y-3">
          <div className="px-4 py-3 bg-stone-800 rounded-lg">
            <motion.div
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-stone-400">Signed in as</p>
              <p className="text-sm font-medium text-amber-400 truncate capitalize">
                {adminData?.role?.replace('_', ' ') || 'Admin'}
              </p>
              <p className="text-xs text-stone-400 mt-1 truncate">
                {adminData?.email || ''}
              </p>
            </motion.div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#D92228] hover:bg-[#B01820] text-white rounded-lg transition-colors font-medium"
          >
            <LogOut size={18} />
            <motion.span
              animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              Logout
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-stone-900 text-white rounded-lg"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="md:hidden fixed left-0 top-0 w-72 h-screen bg-stone-900 text-white z-40 overflow-y-auto flex flex-col"
            >
              <div className="p-6 border-b border-stone-800">
                <h1 className="text-xl font-bold text-[#D92228]">{"Let's Buy"}</h1>
                <p className="text-xs text-stone-400 mt-1">Admin Panel</p>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                        active
                          ? 'bg-[#D92228] text-white'
                          : 'text-stone-300 hover:text-white hover:bg-stone-800'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-stone-800 space-y-3">
                <div className="px-4 py-3 bg-stone-800 rounded-lg">
                  <p className="text-xs text-stone-400">Signed in as</p>
                  <p className="text-sm font-medium text-amber-400 truncate capitalize">
                    {adminData?.role?.replace('_', ' ') || 'Admin'}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 truncate">{adminData?.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#D92228] hover:bg-[#B01820] text-white rounded-lg transition-colors font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          sidebarOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'
        } transition-all duration-300 min-h-screen`}
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">
              {adminMenuItems.find(item => isActive(item.href))?.label || 'Admin Dashboard'}
            </h1>
            <p className="text-sm text-stone-500">{"Manage your Let's Buy platform"}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/notifications"
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors relative"
            >
              <Bell size={20} className="text-stone-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#D92228] rounded-full" />
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-stone-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
