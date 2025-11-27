/**
 * Admin Dashboard
 * Overview statistics and quick actions
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Globe, Users, Activity, Plus, ExternalLink } from 'lucide-react';

interface Stats {
  totalWebsites: number;
  activeWebsites: number;
  totalUsers: number;
  recentActivity: any[];
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalWebsites: 0,
    activeWebsites: 0,
    totalUsers: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get websites count
      const { count: websitesCount } = await supabase
        .from('websites')
        .select('*', { count: 'exact', head: true });

      const { count: activeCount } = await supabase
        .from('websites')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get users count
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get recent activity
      const { data: activity } = await supabase
        .from('activity_log')
        .select('*, user:user_profiles(full_name, email), website:websites(site_title)')
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        totalWebsites: websitesCount || 0,
        activeWebsites: activeCount || 0,
        totalUsers: usersCount || 0,
        recentActivity: activity || [],
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: Globe,
      label: 'Total Websites',
      value: stats.totalWebsites,
      subValue: `${stats.activeWebsites} active`,
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      subValue: 'Editors & Admins',
      color: 'bg-green-500',
    },
    {
      icon: Activity,
      label: 'Recent Activity',
      value: stats.recentActivity.length,
      subValue: 'Last 24 hours',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Link
          to="/admin/websites?new=true"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus size={20} />
          New Website
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentActivity.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Activity size={48} className="mx-auto mb-4 opacity-20" />
              <p>No recent activity</p>
            </div>
          ) : (
            stats.recentActivity.map((activity: any) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        {activity.user?.full_name || activity.user?.email || 'Unknown user'}
                      </span>
                      {' '}
                      <span className="text-gray-600">{activity.action}</span>
                      {' '}
                      <span className="font-medium">{activity.resource}</span>
                      {activity.website && (
                        <>
                          {' on '}
                          <span className="font-medium">{activity.website.site_title}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/websites"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition group"
        >
          <Globe size={32} className="mb-4" />
          <h3 className="text-xl font-bold mb-2">Manage Websites</h3>
          <p className="text-blue-100 mb-4">Create, edit, and manage all your websites</p>
          <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
            Go to Websites <ExternalLink size={16} />
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-lg transition group"
        >
          <Users size={32} className="mb-4" />
          <h3 className="text-xl font-bold mb-2">Manage Users</h3>
          <p className="text-green-100 mb-4">Invite editors and manage permissions</p>
          <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
            Go to Users <ExternalLink size={16} />
          </div>
        </Link>
      </div>
    </div>
  );
};

