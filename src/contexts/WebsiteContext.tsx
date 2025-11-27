/**
 * Website Context
 * Manages current website state (for client sites and editor)
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { detectWebsiteId } from '../lib/website-detector';
import type { WebsiteContextType } from '../types/auth.types';

export const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export const WebsiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWebsite, setCurrentWebsite] = useState<string | null>(null);
  const [websiteData, setWebsiteData] = useState<any | null>(null);
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectAndLoadWebsite();
  }, []);

  const detectAndLoadWebsite = async () => {
    try {
      const websiteId = await detectWebsiteId();
      
      if (websiteId) {
        setCurrentWebsite(websiteId);
        await loadWebsiteData(websiteId);
      }
    } catch (error) {
      console.error('Error detecting website:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWebsiteData = async (websiteId: string) => {
    try {
      // Load website data and section visibility in parallel
      const [websiteResult, sectionsResult] = await Promise.all([
        supabase
          .from('websites')
          .select('*')
          .eq('id', websiteId)
          .single(),
        supabase
          .from('website_sections')
          .select('section_name, is_enabled')
          .eq('website_id', websiteId)
      ]);

      if (websiteResult.error) throw websiteResult.error;
      setWebsiteData(websiteResult.data);

      // Build section visibility map
      if (sectionsResult.data) {
        const visibility: Record<string, boolean> = {};
        sectionsResult.data.forEach((section: any) => {
          visibility[section.section_name] = section.is_enabled ?? true;
        });
        setSectionVisibility(visibility);
      } else {
        // If no sections found, default all to enabled
        setSectionVisibility({});
      }
    } catch (error) {
      console.error('Error loading website data:', error);
    }
  };

  const changeWebsite = async (websiteId: string) => {
    setCurrentWebsite(websiteId);
    await loadWebsiteData(websiteId);
  };

  const value: WebsiteContextType = {
    currentWebsite,
    websiteData,
    setCurrentWebsite: changeWebsite,
    loading,
    sectionVisibility,
  };

  return <WebsiteContext.Provider value={value}>{children}</WebsiteContext.Provider>;
};

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (context === undefined) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
};

