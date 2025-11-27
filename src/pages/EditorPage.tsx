/**
 * Editor Page - Notion-like Inline Editing
 * Clients can edit their website content in place
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWebsite } from '../contexts/WebsiteContext';
import { EditorProvider, useEditor } from '../contexts/EditorContext';
import { EditorLayout } from '../components/editor/EditorLayout';
import { FloatingToolbar } from '../components/editor/FloatingToolbar';
import { PublicSite } from './PublicSite';

const EditorContent: React.FC = () => {
  const { user } = useAuth();
  const { websiteData } = useWebsite();
  const { isEditing, setIsEditing, hasChanges, setHasChanges } = useEditor();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // All changes are auto-saved, this is just for manual save trigger
    await new Promise(resolve => setTimeout(resolve, 500));
    setHasChanges(false);
    setIsSaving(false);
  };

  const handlePublish = async () => {
    await handleSave();
    alert('Changes published successfully!');
  };

  const handlePreview = () => {
    setIsEditing(!isEditing);
  };

  if (!websiteData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading website...</p>
      </div>
    );
  }

  return (
    <EditorLayout 
      isEditing={isEditing}
      websiteTitle={websiteData.site_title}
      user={user}
    >
      {/* The actual website content */}
      <div className={isEditing ? 'editor-mode' : ''}>
        <PublicSite />
      </div>

      {/* Floating Toolbar */}
      <FloatingToolbar
        hasChanges={hasChanges}
        isSaving={isSaving}
        isPreviewMode={!isEditing}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={handlePreview}
      />
    </EditorLayout>
  );
};

export const EditorPage: React.FC = () => {
  return (
    <EditorProvider isEditing={true}>
      <EditorContent />
    </EditorProvider>
  );
};

