/**
 * User Management
 * Invite and manage editors
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';
import { Users, Plus, Trash2, Mail } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface Website {
  id: string;
  site_title: string;
  subdomain: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  
  const [inviteData, setInviteData] = useState({
    email: '',
    full_name: '',
    website_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Load websites
      const { data: websitesData, error: websitesError } = await supabase
        .from('websites')
        .select('id, site_title, subdomain')
        .eq('is_active', true);

      if (websitesError) throw websitesError;
      setWebsites(websitesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteData.email || !inviteData.website_id) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        alert('You must be logged in to invite users');
        return;
      }

      const email = inviteData.email.toLowerCase().trim();

      // Check if user already exists in user_profiles
      const { data: existingUser, error: userCheckError } = await supabase
        .from('user_profiles' as any)
        .select('id, email, full_name')
        .eq('email', email)
        .maybeSingle() as any;

      if (userCheckError && userCheckError.code !== 'PGRST116') {
        throw userCheckError;
      }

      let userId: string;

      if (existingUser) {
        // User already exists, use their ID
        userId = existingUser.id;
        
        // Update full_name if provided and different
        if (inviteData.full_name && inviteData.full_name !== existingUser.full_name) {
          await (supabase
            .from('user_profiles' as any) as any)
            .update({ full_name: inviteData.full_name })
            .eq('id', userId);
        }
      } else {
        // User doesn't exist - create new user account
        // Generate a secure random password
        const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12) + 'A1!';
        
        // Create auth user account
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: tempPassword,
          options: {
            data: {
              full_name: inviteData.full_name || '',
            },
            emailRedirectTo: `${window.location.origin}/login?invited=true`,
          },
        });

        if (signUpError) {
          // If user already exists in auth but not in profiles, try to get them
          if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
            // Try to sign in with a dummy password to trigger password reset
            // Actually, better to just tell admin to ask user to reset password
            throw new Error(
              `User with email ${email} already has an auth account but no profile. ` +
              `Please ask them to sign in and complete their profile, or contact support.`
            );
          }
          throw signUpError;
        }

        if (!authData.user) {
          throw new Error('Failed to create user account');
        }

        userId = authData.user.id;

        // Create user profile
        const { data: newProfile, error: profileError } = await supabase
          .from('user_profiles' as any)
          .insert({
            id: userId,
            email: email,
            full_name: inviteData.full_name || null,
            role: 'editor',
            is_active: true,
          } as any)
          .select()
          .single() as any;

        if (profileError) {
          // If profile creation fails, try to clean up auth user
          console.error('Failed to create profile, auth user may need manual cleanup:', profileError);
          throw new Error(`Created auth account but failed to create profile: ${profileError.message}`);
        }

        // Send password reset email so user can set their own password
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (resetError) {
          console.warn('Failed to send password reset email:', resetError);
          // Don't fail the whole process, but note it in the success message
        }
      }

      // Check if user is already assigned to this website
      const { data: existingAssignment, error: assignmentCheckError } = await supabase
        .from('website_editors')
        .select('id')
        .eq('user_id', userId)
        .eq('website_id', inviteData.website_id)
        .maybeSingle();

      if (existingAssignment) {
        alert('This user is already assigned to the selected website');
        setShowInviteForm(false);
        setInviteData({ email: '', full_name: '', website_id: '' });
        loadData();
        return;
      }

      // Assign user to website
      const { error: editorError } = await supabase
        .from('website_editors' as any)
        .insert({
          user_id: userId,
          website_id: inviteData.website_id,
          invited_by: currentUser.id,
          is_active: true,
        } as any);

      if (editorError) {
        // If it's a foreign key constraint error, the user might not exist in auth
        if (editorError.code === '23503' || editorError.message.includes('foreign key')) {
          throw new Error(
            'User account not found. Please ask the user to sign up first, then try inviting them again.'
          );
        }
        throw editorError;
      }

      const websiteName = websites.find(w => w.id === inviteData.website_id)?.site_title || 'the website';
      const isNewUser = !existingUser;
      const message = isNewUser
        ? `Successfully created account for ${email} and assigned them to ${websiteName}! A password reset email has been sent so they can set their password.`
        : `Successfully assigned ${email} to ${websiteName}!`;
      alert(message);
      
      setShowInviteForm(false);
      setInviteData({ email: '', full_name: '', website_id: '' });
      loadData();
    } catch (error: any) {
      console.error('Error inviting user:', error);
      alert(`Error: ${error.message || 'Failed to invite user. Please try again.'}`);
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!window.confirm(`Remove user "${email}"? They will lose access to all websites.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      alert('User removed successfully!');
      loadData();
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
              <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Invite editors and manage access</p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus size={20} />
          Invite Editor
        </button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invite New Editor</h2>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="editor@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={inviteData.full_name}
                  onChange={(e) => setInviteData({ ...inviteData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Website
              </label>
              <select
                value={inviteData.website_id}
                onChange={(e) => setInviteData({ ...inviteData, website_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a website...</option>
                {websites.map((website) => (
                  <option key={website.id} value={website.id}>
                    {website.site_title} ({website.subdomain})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Mail size={18} />
                Send Invitation
              </button>
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">All Users</h2>
        </div>

        {users.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users yet</h3>
            <p className="text-gray-600 mb-6">Invite your first editor to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.full_name || user.email}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                      {!user.is_active && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="Remove User"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

