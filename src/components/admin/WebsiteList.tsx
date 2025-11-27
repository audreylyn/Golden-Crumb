/**
 * Website List
 * Manage all websites (CRUD operations)
 */

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Globe, Plus, ExternalLink, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { buildWebsiteUrl } from '../../lib/website-detector';

interface Website {
  id: string;
  site_title: string;
  subdomain: string;
  is_active: boolean;
  created_at: string;
  theme_preset_id: string | null;
}

export const WebsiteList: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const showNewForm = searchParams.get('new') === 'true';

  const [newWebsite, setNewWebsite] = useState({
    site_title: '',
    subdomain: '',
  });

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebsites(data || []);
    } catch (error) {
      console.error('Error loading websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get default theme
      const { data: theme } = await supabase
        .from('theme_presets')
        .select('id')
        .eq('name', 'golden-warmth')
        .single();

      const { error } = await supabase
        .from('websites')
        .insert([{
          site_title: newWebsite.site_title,
          subdomain: newWebsite.subdomain,
          theme_preset_id: theme?.id,
          is_active: true,
        }]);

      if (error) throw error;

      alert('Website created successfully!');
      setNewWebsite({ site_title: '', subdomain: '' });
      loadWebsites();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('websites')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadWebsites();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: string, subdomain: string) => {
    if (!window.confirm(`Are you sure you want to delete "${subdomain}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Website deleted successfully!');
      loadWebsites();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Websites</h1>
          <p className="text-gray-600 mt-1">Manage all your websites</p>
        </div>
      </div>

      {/* Create New Website Form */}
      {showNewForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Website</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Title
                </label>
                <input
                  type="text"
                  value={newWebsite.site_title}
                  onChange={(e) => setNewWebsite({ ...newWebsite, site_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Bakery"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subdomain
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newWebsite.subdomain}
                    onChange={(e) => setNewWebsite({ ...newWebsite, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="my-bakery"
                    required
                  />
                  <span className="text-sm text-gray-500">.likhasiteworks.dev</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Create Website
              </button>
              <Link
                to="/admin/websites"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* Website List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">All Websites</h2>
          <Link
            to="/admin/websites?new=true"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
          >
            <Plus size={18} />
            New Website
          </Link>
        </div>

        {websites.length === 0 ? (
          <div className="p-12 text-center">
            <Globe size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No websites yet</h3>
            <p className="text-gray-600 mb-6">Create your first website to get started</p>
            <Link
              to="/admin/websites?new=true"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={20} />
              Create Website
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {websites.map((website) => (
              <div key={website.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{website.site_title}</h3>
                      {website.is_active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <Eye size={12} />
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <EyeOff size={12} />
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <a
                        href={buildWebsiteUrl(website.subdomain)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {website.subdomain}.likhasiteworks.dev
                      </a>
                    </p>
                    <p className="text-xs text-gray-500">
                      Created {new Date(website.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={buildWebsiteUrl(website.subdomain)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                      title="View Site"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <a
                      href={buildWebsiteUrl(website.subdomain, '', 'editor')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      title="Edit Site"
                    >
                      <Edit size={18} />
                    </a>
                    <button
                      onClick={() => handleToggleActive(website.id, website.is_active)}
                      className={`p-2 rounded-lg transition ${
                        website.is_active
                          ? 'text-orange-600 hover:bg-orange-100'
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={website.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {website.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(website.id, website.subdomain)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

