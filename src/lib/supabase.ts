/**
 * Supabase Client Configuration
 * WebGen-AI - Database connection setup
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.types';

// Supabase connection details
const SUPABASE_URL = 'https://pijhvlrjgsykqtgvcpaq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpamh2bHJqZ3N5a3F0Z3ZjcGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMTgzNjYsImV4cCI6MjA3OTc5NDM2Nn0.XsiBpgTOo0Lskr5IpjViutsbnzTsFGR-eB5jL8mL6ao';

// Create and export the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to get the current website by subdomain
export const getCurrentWebsiteId = async (subdomain: string = 'golden-crumb'): Promise<string | null> => {
  const { data, error } = await supabase
    .from('websites')
    .select('id')
    .eq('subdomain', subdomain)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    if (error) console.error('Error fetching website:', error);
    return null;
  }

  return (data as { id: string }).id;
};

// For development, we'll use a cached website ID
let cachedWebsiteId: string | null = null;

export const getWebsiteId = async (): Promise<string | null> => {
  if (cachedWebsiteId) return cachedWebsiteId;
  
  cachedWebsiteId = await getCurrentWebsiteId('golden-crumb');
  return cachedWebsiteId;
};

