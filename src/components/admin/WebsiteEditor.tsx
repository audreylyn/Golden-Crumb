/**
 * Website Editor
 * Edit specific website settings and theme
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Palette, MessageCircle } from 'lucide-react';
import type { ThemePreset } from '../../types/auth.types';

export const WebsiteEditor: React.FC = () => {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [website, setWebsite] = useState<any>(null);
  const [themePresets, setThemePresets] = useState<ThemePreset[]>([]);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [facebookMessengerId, setFacebookMessengerId] = useState('');
  const [chatSupportEnabled, setChatSupportEnabled] = useState(false);
  const [chatSupportConfig, setChatSupportConfig] = useState<any>(null);
  const [chatbotProvider, setChatbotProvider] = useState<'simple' | 'botpress' | 'dialogflow' | 'openai' | 'custom'>('simple');
  const [chatbotApiKey, setChatbotApiKey] = useState('');
  const [chatbotBotId, setChatbotBotId] = useState('');
  const [chatbotWebhookUrl, setChatbotWebhookUrl] = useState('');
  const [chatbotConfigJson, setChatbotConfigJson] = useState('{}');
  
  // Get domain from environment variable or use default
  const domain = import.meta.env.VITE_DOMAIN || 'likhasiteworks.studio';

  useEffect(() => {
    loadData();
  }, [websiteId]);

  const loadData = async () => {
    try {
      // Load website
      const { data: websiteData, error: websiteError } = await supabase
        .from('websites')
        .select('*')
        .eq('id', websiteId)
        .single();

      if (websiteError) throw websiteError;
      setWebsite(websiteData);

      // Load theme presets
      const { data: themesData, error: themesError } = await supabase
        .from('theme_presets')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (themesError) throw themesError;
      setThemePresets(themesData || []);

      // Load contact info for Facebook Messenger ID
      const { data: contactData, error: contactError } = await supabase
        .from('contact_info')
        .select('*')
        .eq('website_id', websiteId)
        .single();

      if (!contactError && contactData) {
        setContactInfo(contactData);
        // Get Facebook Messenger ID from contact_info
        // It can be stored in facebook_messenger_id field or in social_links.facebook
        setFacebookMessengerId(contactData.facebook_messenger_id || contactData.social_links?.facebook_messenger || '');
      }

      // Load chat support config
      const { data: chatData, error: chatError } = await supabase
        .from('chat_support_config')
        .select('*')
        .eq('website_id', websiteId)
        .single();

      if (!chatError && chatData) {
        setChatSupportConfig(chatData);
        setChatSupportEnabled(chatData.is_enabled || false);
        setChatbotProvider(chatData.chatbot_provider || 'simple');
        setChatbotApiKey(chatData.chatbot_api_key || '');
        setChatbotBotId(chatData.chatbot_bot_id || '');
        setChatbotWebhookUrl(chatData.chatbot_webhook_url || '');
        setChatbotConfigJson(JSON.stringify(chatData.chatbot_config || {}, null, 2));
      } else if (chatError && chatError.code === 'PGRST116') {
        // Chat support config doesn't exist, create default (disabled)
        const { data: newChatData, error: createError } = await supabase
          .from('chat_support_config')
          .insert({
            website_id: websiteId,
            is_enabled: false,
            greeting_message: 'Hi! How can we help you today?',
            agent_name: 'Support',
            position: 'bottom-right',
          })
          .select()
          .single();

        if (!createError && newChatData) {
          setChatSupportConfig(newChatData);
          setChatSupportEnabled(false);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update website
      const { error: websiteError } = await supabase
        .from('websites')
        .update({
          site_title: website.site_title,
          subdomain: website.subdomain,
          theme_preset_id: website.theme_preset_id,
        })
        .eq('id', websiteId);

      if (websiteError) throw websiteError;

      // Update or create contact_info with Facebook Messenger ID
      if (contactInfo) {
        // Update existing contact_info
        const socialLinks = contactInfo.social_links || {};
        const { error: contactError } = await supabase
          .from('contact_info')
          .update({
            facebook_messenger_id: facebookMessengerId || null,
            social_links: {
              ...socialLinks,
              facebook_messenger: facebookMessengerId || '',
            },
          })
          .eq('id', contactInfo.id);

        if (contactError) throw contactError;
      } else if (websiteId) {
        // Create new contact_info if it doesn't exist
        const { error: contactError } = await supabase
          .from('contact_info')
          .insert({
            website_id: websiteId,
            heading: 'Get in Touch',
            facebook_messenger_id: facebookMessengerId || null,
            social_links: {
              facebook: '',
              instagram: '',
              twitter: '',
              facebook_messenger: facebookMessengerId || '',
            },
          });

        if (contactError) throw contactError;
      }

      // Update chat support config with chatbot settings
      let chatbotConfig = {};
      try {
        chatbotConfig = JSON.parse(chatbotConfigJson);
      } catch (e) {
        console.warn('Invalid chatbot config JSON, using empty object');
      }

      if (chatSupportConfig && websiteId) {
        const { error: chatError } = await supabase
          .from('chat_support_config')
          .update({
            is_enabled: chatSupportEnabled,
            chatbot_provider: chatbotProvider,
            chatbot_api_key: chatbotApiKey || null,
            chatbot_bot_id: chatbotBotId || null,
            chatbot_webhook_url: chatbotWebhookUrl || null,
            chatbot_config: chatbotConfig,
          })
          .eq('id', chatSupportConfig.id);

        if (chatError) throw chatError;
      } else if (websiteId && !chatSupportConfig) {
        // Create chat support config if it doesn't exist
        const { error: chatError } = await supabase
          .from('chat_support_config')
          .insert({
            website_id: websiteId,
            is_enabled: chatSupportEnabled,
            greeting_message: 'Hi! How can we help you today?',
            agent_name: 'Support',
            position: 'bottom-right',
            chatbot_provider: chatbotProvider,
            chatbot_api_key: chatbotApiKey || null,
            chatbot_bot_id: chatbotBotId || null,
            chatbot_webhook_url: chatbotWebhookUrl || null,
            chatbot_config: chatbotConfig,
          });

        if (chatError) throw chatError;
      }

      alert('Website updated successfully!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="p-8">
        <p className="text-red-600">Website not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/websites')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Websites
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{website.site_title}</h1>
        <p className="text-gray-600 mt-1">Edit website settings and theme</p>
      </div>

      {/* Settings Form */}
      <div className="max-w-2xl space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Title
              </label>
              <input
                type="text"
                value={website.site_title}
                onChange={(e) => setWebsite({ ...website, site_title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subdomain
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={website.subdomain}
                  onChange={(e) => setWebsite({ ...website, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-500">.{domain}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={24} className="text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Theme</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Choose from 5 professional theme presets</p>
          
          <div className="grid grid-cols-1 gap-3">
            {themePresets.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setWebsite({ ...website, theme_preset_id: theme.id })}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  website.theme_preset_id === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{theme.display_name}</h3>
                  {website.theme_preset_id === theme.id && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                <div className="flex gap-2">
                  {Object.entries(theme.colors).slice(0, 4).map(([key, value]) => (
                    <div
                      key={key}
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: value as string }}
                      title={key}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={24} className="text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Integrations</h2>
          </div>
          
          <div className="space-y-6">
            {/* Facebook Messenger */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Messenger ID
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Enter your Facebook Page ID or Username. When customers checkout, they will be redirected to your Messenger.
              </p>
              <input
                type="text"
                value={facebookMessengerId}
                onChange={(e) => setFacebookMessengerId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your-page-id or your-page-username"
              />
              <p className="text-xs text-gray-500 mt-2">
                Example: <code className="bg-gray-100 px-1 rounded">yourbakery</code> or <code className="bg-gray-100 px-1 rounded">123456789012345</code>
              </p>
            </div>

            {/* Chat Support Toggle */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chat Support
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable live chat support widget on your website. Disabled by default.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setChatSupportEnabled(!chatSupportEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    chatSupportEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      chatSupportEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Chatbot Configuration */}
              {chatSupportEnabled && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chatbot Provider
                    </label>
                    <select
                      value={chatbotProvider}
                      onChange={(e) => setChatbotProvider(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="simple">Simple (Rule-based)</option>
                      <option value="botpress">Botpress</option>
                      <option value="dialogflow">Dialogflow (Google)</option>
                      <option value="openai">OpenAI GPT</option>
                      <option value="custom">Custom Webhook</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {chatbotProvider === 'simple' && 'Basic keyword matching (free)'}
                      {chatbotProvider === 'botpress' && 'Professional chatbot platform with visual builder'}
                      {chatbotProvider === 'dialogflow' && 'Google\'s conversational AI'}
                      {chatbotProvider === 'openai' && 'GPT-powered intelligent chatbot'}
                      {chatbotProvider === 'custom' && 'Your own webhook-based chatbot'}
                    </p>
                  </div>

                  {chatbotProvider !== 'simple' && (
                    <>
                      {chatbotProvider !== 'custom' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            API Key
                          </label>
                          <input
                            type="password"
                            value={chatbotApiKey}
                            onChange={(e) => setChatbotApiKey(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                            placeholder="Enter your API key"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Your API key is stored securely. See guide for setup instructions.
                          </p>
                        </div>
                      )}

                      {(chatbotProvider === 'botpress' || chatbotProvider === 'dialogflow') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bot ID
                          </label>
                          <input
                            type="text"
                            value={chatbotBotId}
                            onChange={(e) => setChatbotBotId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={chatbotProvider === 'botpress' ? 'Your Botpress Bot ID' : 'Google Cloud Project ID'}
                          />
                        </div>
                      )}

                      {chatbotProvider === 'custom' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Webhook URL
                          </label>
                          <input
                            type="url"
                            value={chatbotWebhookUrl}
                            onChange={(e) => setChatbotWebhookUrl(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://your-api.com/chatbot"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Advanced Config (JSON)
                        </label>
                        <textarea
                          value={chatbotConfigJson}
                          onChange={(e) => setChatbotConfigJson(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                          placeholder='{"model": "gpt-3.5-turbo", "temperature": 0.7}'
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Provider-specific configuration. See integration guide for examples.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

