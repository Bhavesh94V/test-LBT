'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Home,
    ShoppingCart,
    BookOpen,
    Users,
    FileText,
    LogOut,
    ChevronDown,
    HelpCircle,
    Newspaper,
    Settings
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileDropdownProps {
    className?: string;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ className = '' }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    if (!user) return null;

    // Get user initials for avatar
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    const initials = fullName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`h-auto p-0 hover:bg-transparent ${className}`}>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                                {initials}
                            </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 bg-background border border-border shadow-lg rounded-lg">
                {/* Profile Section */}
                <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="px-4 py-4 border-b border-border cursor-pointer block hover:bg-muted">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-semibold text-primary">
                                    {initials}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground text-base truncate">
                                    {fullName}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">
                                    {user.phone}
                                </p>
                                <p className="text-xs text-muted-foreground truncate mt-1">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </Link>
                </DropdownMenuItem>

                {/* Navigation Section */}
                <div className="py-2 border-b border-border">
                    <div className="px-2 py-2">
                        <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">NAVIGATION</p>
                        <DropdownMenuItem asChild>
                            <Link to="/" className="flex items-center gap-3 cursor-pointer px-2 py-2">
                                <Home className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Home</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/properties" className="flex items-center gap-3 cursor-pointer px-2 py-2">
                                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Properties</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/how-it-works" className="flex items-center gap-3 cursor-pointer px-2 py-2">
                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">How It Works</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/about" className="flex items-center gap-3 cursor-pointer px-2 py-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">About Us</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/contact" className="flex items-center gap-3 cursor-pointer px-2 py-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Contact Us</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/faqs" className="flex items-center gap-3 cursor-pointer px-2 py-2">
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Resources</span>
                            </Link>
                        </DropdownMenuItem>
                    </div>
                </div>

                {/* Account Section */}
                <div className="py-2 border-b border-border">
                    <div className="px-2 py-2">
                        <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">ACCOUNT</p>
                        <DropdownMenuItem asChild>
                            <Link to="/dashboard?tab=groups" onClick={() => setIsOpen(false)} className="flex items-center gap-3 cursor-pointer px-2 py-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Your Groups</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/dashboard?tab=payments" onClick={() => setIsOpen(false)} className="flex items-center gap-3 cursor-pointer px-2 py-2">
                                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Your Payments</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/dashboard?tab=shortlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 cursor-pointer px-2 py-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">Shortlist Properties</span>
                            </Link>
                        </DropdownMenuItem>
                    </div>
                </div>

                {/* Admin Section */}
                <div className="py-2 border-b border-border">
                    <div className="px-2 py-2">
                        <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">ADMIN</p>
                        <DropdownMenuItem asChild>
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 cursor-pointer px-2 py-2 text-amber-600 hover:bg-amber-50">
                                <Settings className="w-4 h-4" />
                                <span className="text-sm font-medium">Admin Panel</span>
                            </Link>
                        </DropdownMenuItem>
                    </div>
                </div>

                {/* Logout Section */}
                <div className="py-2">
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-3 cursor-pointer px-4 py-2 text-destructive hover:text-destructive hover:bg-destructive/10 mx-1 rounded"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserProfileDropdown;
