/**
 * Main App Router
 * Handles routing between public site, editor, and admin
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './src/contexts/AuthContext';
import { WebsiteProvider } from './src/contexts/WebsiteContext';
import { RequireAuth, RequireAdmin, RequireWebsiteAccess } from './src/components/ProtectedRoute';
import { WebsiteSelector } from './src/components/WebsiteSelector';
import { getCurrentMode } from './src/lib/website-detector';

// Pages
import { Login } from './src/pages/Login';
import { PublicSite } from './src/pages/PublicSite';
import { EditorPage } from './src/pages/EditorPage';
import { AdminPage } from './src/pages/AdminPage';

// Root Router Component - Shows PublicSite when website is specified
const PublicSiteRouter: React.FC = () => {
  const hasWebsiteParam = new URLSearchParams(window.location.search).has('site');
  
  // Only show public site if website is specified via query param
  if (hasWebsiteParam) {
    return <PublicSite />;
  }
  
  // Otherwise redirect to login (root)
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WebsiteProvider>
          <Routes>
            {/* Root Route - Login Page */}
            <Route path="/" element={<Login />} />

            {/* Login Route (also accessible) */}
            <Route path="/login" element={<Login />} />

            {/* Website Selector (Protected) - For localhost development */}
            <Route
              path="/websites"
              element={
                <RequireAuth>
                  <WebsiteSelector />
                </RequireAuth>
              }
            />

            {/* Public Site - Only when website is specified */}
            <Route path="/site" element={<PublicSiteRouter />} />

            {/* Editor Route (Protected) */}
            <Route
              path="/edit"
              element={
                <RequireAuth>
                  <RequireWebsiteAccess>
                    <EditorPage />
                  </RequireWebsiteAccess>
                </RequireAuth>
              }
            />

            {/* Admin Routes (Protected) */}
            <Route
              path="/admin/*"
              element={
                <RequireAuth>
                  <RequireAdmin>
                    <AdminPage />
                  </RequireAdmin>
                </RequireAuth>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WebsiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;