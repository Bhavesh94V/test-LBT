'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Building2, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api';

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  open: { label: 'Active', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  active: { label: 'Active', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  full: { label: 'Full', icon: Users, color: 'bg-orange-100 text-orange-700' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700' },
};

const YourGroups: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    const fetchGroups = async () => {
      try {
        const response = await apiClient.get('/users/groups');
        const data = response.data?.data?.groups || response.data?.data || [];
        setGroups(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('[YourGroups] Failed to fetch groups:', err);
        setGroups([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Please Login</h2>
          <p className="text-muted-foreground mb-6">You need to login to view your groups.</p>
          <Button onClick={() => navigate('/properties')} className="bg-[#D92228] hover:bg-[#b01c21] text-white">
            Explore Properties
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-surface-offwhite py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Groups</h1>
            <p className="text-muted-foreground">
              Track and manage all your active and past group buying participations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Groups List */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#D92228]" />
            </div>
          ) : groups.length > 0 ? (
            <div className="space-y-6">
              {groups.map((group: any, index: number) => {
                const status = group.status || 'open';
                const config = statusConfig[status] || statusConfig.open;
                const StatusIcon = config.icon;
                const propertyName = group.propertyId?.name || group.groupName || 'Unknown Property';
                const location = group.propertyId?.location || '';
                const membersJoined = group.membersJoined || group.members?.length || 0;
                const totalSlots = group.totalSlots || 25;

                return (
                  <motion.div
                    key={group._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface-offwhite rounded-2xl p-6 md:p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-foreground">{propertyName}</h2>
                          <Badge className={config.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Group #{group.groupNumber || 1}</p>
                        <p className="text-lg font-bold text-[#D92228]">{group.configuration || 'Mixed'}</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-[#D92228]" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Configuration</p>
                          <p className="font-medium text-foreground">{group.configuration || 'Mixed'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-[#D92228]" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Join Deadline</p>
                          <p className="font-medium text-foreground">{group.joinDeadline || 'Open'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#D92228]" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Group Size</p>
                          <p className="font-medium text-foreground">{membersJoined}/{totalSlots}</p>
                        </div>
                      </div>
                      <div className="sm:col-span-2 md:col-span-1">
                        <div className="h-2 bg-background rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full bg-[#D92228] rounded-full transition-all"
                            style={{ width: `${(membersJoined / totalSlots) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{Math.round((membersJoined / totalSlots) * 100)}% filled</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        {group.locked ? 'Group is locked' : `${totalSlots - membersJoined} slots remaining`}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/properties/${group.propertyId?._id || group.propertyId}`)}
                        className="border-stone-200 hover:border-[#D92228] hover:text-[#D92228] bg-transparent"
                      >
                        View Property
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Groups Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't joined any buyer groups yet. Explore properties and join a group to get started.
              </p>
              <Button onClick={() => navigate('/properties')} className="bg-[#D92228] hover:bg-[#b01c21] text-white">
                Explore Properties
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default YourGroups;
