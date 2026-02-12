'use client';

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Home, Building2, Users, Heart, LogOut, ShoppingCart, DollarSign, Bookmark, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
    children: React.ReactNode;
    defaultTab?: 'profile' | 'groups' | 'payments' | 'shortlist';
}

const menuItems = [
    {
        section: 'Navigation',
        items: [
            { id: 'home', label: 'Home', icon: Home, href: '/', external: true },
            { id: 'properties', label: 'Properties', icon: Building2, href: '/properties', external: true },
            { id: 'about', label: 'About Us', icon: Users, href: '/about', external: true },
            { id: 'contact', label: 'Contact Us', icon: ShoppingCart, href: '/contact', external: true },
        ],
    },
    {
        section: 'Account',
        items: [
            { id: 'groups', label: 'Your Groups', icon: Users, href: '/dashboard?tab=groups', external: false },
            { id: 'payments', label: 'Your Payments', icon: DollarSign, href: '/dashboard?tab=payments', external: false },
            { id: 'shortlist', label: 'Shortlist Properties', icon: Bookmark, href: '/dashboard?tab=shortlist', external: false },
        ],
    },
    {
        section: 'Settings',
        items: [
            { id: 'profile', label: 'Profile', icon: User, href: '/dashboard', external: false },
        ],
    },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const getActiveTab = () => {
        const params = new URLSearchParams(location.search);
        return params.get('tab') || 'profile';
    };

    const activeTab = getActiveTab();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <h1 className="text-xl font-semibold text-stone-900">Dashboard</h1>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Mobile overlay */}
                {sidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black/30 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}
                {/* Sidebar - Always visible on lg, toggle on mobile */}
                <aside className={`${sidebarOpen ? 'fixed top-16 left-0 bottom-0 z-30 shadow-xl' : 'hidden'} lg:block lg:static lg:z-auto w-64 bg-stone-50 border-r border-stone-200 overflow-y-auto lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16`}>
                    <div>
                            <div className="p-6 space-y-8">
                                {/* User Info Section */}
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-[#D92228] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                        {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <h3 className="font-semibold text-stone-900">{`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}</h3>
                                    <p className="text-sm text-stone-500">{user?.phone}</p>
                                </div>

                                {/* Menu Sections */}
                                {menuItems.map((section, idx) => (
                                    <div key={idx}>
                                        <h4 className="text-xs font-semibold text-stone-400 uppercase mb-3">{section.section}</h4>
                                        <div className="space-y-2">
                                            {section.items.map((item) => {
                                                const Icon = item.icon;
                                                const isActive = item.id === activeTab || (item.id === 'profile' && activeTab === 'profile');
                                                const isExternal = (item as any).external;

                                                if (isExternal) {
                                                    return (
                                                        <a
                                                            key={item.id}
                                                            href={item.href}
                                                            onClick={() => setSidebarOpen(false)}
                                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
                                                                    ? 'bg-[#D92228] text-white'
                                                                    : 'text-stone-700 hover:bg-stone-100'
                                                                }`}
                                                        >
                                                            <Icon className="w-5 h-5" />
                                                            <span className="text-sm font-medium">{item.label}</span>
                                                        </a>
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={item.id}
                                                        to={item.href}
                                                        onClick={() => setSidebarOpen(false)}
                                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
                                                    ? 'bg-[#D92228] text-white'
                                                                    : 'text-stone-700 hover:bg-stone-100'
                                                            }`}
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                        <span className="text-sm font-medium">{item.label}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 w-full lg:w-auto">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
