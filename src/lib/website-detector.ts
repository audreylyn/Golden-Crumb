/**
 * Website Detection Utility
 * Detects current website from subdomain or query parameter
 */

import { supabase } from './supabase';

/**
 * Extract subdomain from hostname
 */
export function getSubdomain(hostname: string): string | null {
  // Skip localhost
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    return null;
  }

  // Extract subdomain
  // Example: bakery.likhasiteworks.studio → bakery
  const parts = hostname.split('.');
  
  // Need at least 3 parts (subdomain.domain.tld)
  if (parts.length < 3) {
    return null;
  }

  // Ignore 'www' and 'admin'
  const subdomain = parts[0];
  if (subdomain === 'www' || subdomain === 'admin') {
    return null;
  }

  return subdomain;
}

/**
 * Get current website ID from subdomain or query parameter
 */
export async function detectWebsiteId(): Promise<string | null> {
  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      return null;
    }

    const hostname = window.location.hostname;
    const params = new URLSearchParams(window.location.search);

    // Development: Check for ?site= parameter first
    const siteParam = params.get('site') || params.get('website');
    if (siteParam) {
      // Check if user is authenticated (admins can access inactive websites)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Build query
      let query = supabase
        .from('websites')
        .select('id')
        .eq('subdomain', siteParam);
      
      // Only filter by is_active if user is not authenticated
      // (authenticated users can access inactive websites via admin policy)
      if (!user) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query.single();

      if (error) {
        console.error('Error fetching website by parameter:', error);
        return null;
      }

      return data?.id || null;
    }

    // Production: Extract from subdomain
    const subdomain = getSubdomain(hostname);
    if (!subdomain) {
      return null;
    }

    // Fetch website by subdomain
    const { data, error } = await supabase
      .from('websites')
      .select('id')
      .eq('subdomain', subdomain)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching website by subdomain:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error detecting website:', error);
    return null;
  }
}

/**
 * Check if current route is admin
 */
export function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.location.pathname.startsWith('/admin');
}

/**
 * Check if current route is editor
 */
export function isEditorRoute(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.location.pathname.startsWith('/edit');
}

/**
 * Get current mode: 'public' | 'editor' | 'admin'
 */
export function getCurrentMode(): 'public' | 'editor' | 'admin' {
  if (isAdminRoute()) return 'admin';
  if (isEditorRoute()) return 'editor';
  return 'public';
}

/**
 * Build URL for website
 */
export function buildWebsiteUrl(
  subdomain: string,
  path: string = '',
  mode: 'public' | 'editor' = 'public'
): string {
  const isDev = window.location.hostname === 'localhost';
  
  if (isDev) {
    // Development: Use query parameter
    const base = `http://localhost:${window.location.port || 3000}`;
    const editPath = mode === 'editor' ? '/edit' : '';
    return `${base}${editPath}${path}?site=${subdomain}`;
  } else {
    // Production: Use subdomain
    // Use environment variable or default to likhasiteworks.studio
    const domain = import.meta.env.VITE_DOMAIN || 'likhasiteworks.studio';
    const editPath = mode === 'editor' ? '/edit' : '';
    return `https://${subdomain}.${domain}${editPath}${path}`;
  }
}

