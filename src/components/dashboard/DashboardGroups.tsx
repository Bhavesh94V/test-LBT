'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Building2, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import apiService from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<string, any> = {
  active: { label: 'Active', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700' },
  locked: { label: 'Locked', icon: CheckCircle, color: 'bg-amber-100 text-amber-700' },
};

const DashboardGroups: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await apiService.getUserGroups();
        const data = response?.data?.data?.groups || response?.data?.data || response?.data?.groups || [];
        setGroups(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('[DashboardGroups] Error:', error);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#D92228]" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Your Groups</h2>
        <p className="text-stone-500">Track and manage all your active and past group buying participations</p>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-6">
          {groups.map((group: any, index: number) => {
            const status = group.status || 'active';
            const config = statusConfig[status] || statusConfig.active;
            const StatusIcon = config.icon;
            const groupSize = group.membersCount || group.members?.length || 0;
            const totalPositions = group.maxMembers || group.totalPositions || 25;
            return (
              <motion.div
                key={group._id || group.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-stone-900">{group.propertyName || group.name || 'Buying Group'}</h3>
                      <Badge className={config.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-stone-500 text-sm">
                      {group.developer || 'Developer'} - {group.location || 'Location'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-500">Estimated Savings</p>
                    <p className="text-xl font-bold text-[#D92228]">{group.estimatedSavings || group.savings || 'TBD'}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[#D92228]" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Configuration</p>
                      <p className="font-medium text-stone-900 text-sm">{group.configuration || group.config || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#D92228]" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Joined Date</p>
                      <p className="font-medium text-stone-900 text-sm">{group.joinedDate || new Date(group.createdAt).toLocaleDateString() || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#D92228]" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Group Size</p>
                      <p className="font-medium text-stone-900 text-sm">{groupSize}/{totalPositions}</p>
                    </div>
                  </div>
                  <div>
                    <div className="h-2 bg-white rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-[#D92228] rounded-full" style={{ width: `${(groupSize / totalPositions) * 100}%` }} />
                    </div>
                    <p className="text-xs text-stone-500">{Math.round((groupSize / totalPositions) * 100)}% filled</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-stone-200">
                  <p className="text-sm text-stone-500">
                    <span className="font-medium text-stone-900">Next:</span> {group.nextMilestone || 'Updates coming soon'}
                  </p>
                  <Button variant="outline" onClick={() => navigate(`/properties/${group.propertyId || group._id}`)} className="border-stone-300 bg-transparent text-stone-700">
                    View Details
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-50 rounded-2xl">
          <Users className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-900 mb-2">No Groups Yet</h3>
          <p className="text-stone-500 mb-6">You haven't joined any buyer groups yet.</p>
          <Button onClick={() => navigate('/properties')} className="bg-[#D92228] hover:bg-[#B01820] text-white">
            Explore Properties
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardGroups;
