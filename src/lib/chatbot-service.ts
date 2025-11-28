/**
 * Chatbot Service
 * Handles integration with various chatbot providers
 * Each website can have its own chatbot configuration
 */

import { supabase, getWebsiteId } from './supabase';

export type ChatbotProvider = 'simple' | 'botpress' | 'gemini';

export interface ChatbotConfig {
  provider: ChatbotProvider;
  apiKey?: string;
  botId?: string;
  webhookUrl?: string;
  config?: Record<string, any>;
  knowledgeBase?: string;
}

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

/**
 * Get chatbot configuration for current website
 */
export async function getChatbotConfig(): Promise<ChatbotConfig | null> {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) return null;

    const { data, error } = await supabase
      .from('chat_support_config')
      .select('chatbot_provider, chatbot_api_key, chatbot_bot_id, chatbot_webhook_url, chatbot_config, knowledge_base')
      .eq('website_id', websiteId)
      .single();

    if (error || !data) return null;

    // Check if knowledge_base is a URL (GitHub Gist or other)
    let knowledgeBase = data.knowledge_base || undefined;
    if (knowledgeBase && (knowledgeBase.startsWith('http://') || knowledgeBase.startsWith('https://'))) {
      // It's a URL, fetch it
      try {
        const response = await fetch(knowledgeBase);
        if (response.ok) {
          knowledgeBase = await response.text();
        } else {
          console.warn('Failed to fetch knowledge base from URL:', knowledgeBase);
          knowledgeBase = undefined;
        }
      } catch (err) {
        console.error('Error fetching knowledge base URL:', err);
        knowledgeBase = undefined;
      }
    }

    return {
      provider: (data.chatbot_provider as ChatbotProvider) || 'simple',
      apiKey: data.chatbot_api_key || undefined,
      botId: data.chatbot_bot_id || undefined,
      webhookUrl: data.chatbot_webhook_url || undefined,
      config: (data.chatbot_config as Record<string, any>) || {},
      knowledgeBase: knowledgeBase,
    };
  } catch (error) {
    console.error('Error fetching chatbot config:', error);
    return null;
  }
}

/**
 * Send message to chatbot and get response
 */
export async function sendChatbotMessage(
  message: string,
  conversationId?: string
): Promise<string> {
  const config = await getChatbotConfig();
  
  if (!config) {
    return "I'm sorry, I'm having trouble connecting. Please try again later.";
  }

  switch (config.provider) {
    case 'simple':
      return handleSimpleBot(message, config.knowledgeBase);
    
    case 'botpress':
      return handleBotpress(message, config, conversationId);
    
    case 'gemini':
      return handleGemini(message, config, conversationId);
    
    default:
      return handleSimpleBot(message, config.knowledgeBase);
  }
}

/**
 * Simple rule-based bot (fallback/default)
 */
function handleSimpleBot(message: string, knowledgeBase?: string): string {
  const lowerInput = message.toLowerCase();

  // If knowledge base exists, try to extract relevant info
  if (knowledgeBase) {
    // Simple keyword matching against knowledge base
    const kbLower = knowledgeBase.toLowerCase();
    
    // Check if knowledge base contains relevant information
    if (lowerInput.includes('hour') || lowerInput.includes('open') || lowerInput.includes('time')) {
      const hourMatch = kbLower.match(/hour[s]?[:\s]+([^\.\n]+)/i) || kbLower.match(/open[s]?[:\s]+([^\.\n]+)/i);
      if (hourMatch) {
        return hourMatch[1].trim() || "Please check our business hours in the knowledge base.";
      }
    }
    
    if (lowerInput.includes('location') || lowerInput.includes('address') || lowerInput.includes('where')) {
      const locationMatch = kbLower.match(/location[:\s]+([^\.\n]+)/i) || kbLower.match(/address[:\s]+([^\.\n]+)/i);
      if (locationMatch) {
        return locationMatch[1].trim() || "Please check our location in the knowledge base.";
      }
    }
  }

  // Fallback to default responses
  if (lowerInput.includes('menu') || lowerInput.includes('food') || lowerInput.includes('bread') || lowerInput.includes('cake')) {
    return "You can view our full daily selection in the Menu section above! We have fresh sourdough, croissants, cakes, and artisan pastries.";
  } else if (lowerInput.includes('hour') || lowerInput.includes('open') || lowerInput.includes('time')) {
    return "We are open Monday-Friday from 7:00 AM to 7:00 PM, and weekends from 8:00 AM to 5:00 PM.";
  } else if (lowerInput.includes('location') || lowerInput.includes('address') || lowerInput.includes('where')) {
    return "We are located at 123 Baker Street, Culinary District, FL 33101. We'd love to see you!";
  } else if (lowerInput.includes('delivery') || lowerInput.includes('order') || lowerInput.includes('shipping')) {
    return "We offer local delivery within a 5-mile radius for orders over ₱500. You can also find us on GrabFood and FoodPanda for instant delivery.";
  } else if (lowerInput.includes('gluten') || lowerInput.includes('vegan') || lowerInput.includes('allergy')) {
    return "Yes! We bake fresh gluten-free muffins and bread daily. We also have a selection of vegan pastries like our fruit tarts.";
  }

  return "Thanks for your message! One of our team members will get back to you shortly.";
}

/**
 * Botpress integration
 * Documentation: https://botpress.com/docs/build/channels/webchat
 */
async function handleBotpress(
  message: string,
  config: ChatbotConfig,
  conversationId?: string
): Promise<string> {
  if (!config.botId || !config.apiKey) {
    console.error('Botpress: Missing botId or apiKey');
    return handleSimpleBot(message, config.knowledgeBase);
  }

  try {
    // Botpress API endpoint
    const apiUrl = `https://api.botpress.cloud/v1/chat/${config.botId}/messages`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        userId: conversationId || `user-${Date.now()}`,
        type: 'text',
        text: message,
        conversationId: conversationId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Botpress API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Botpress response format may vary, adjust based on their API
    if (data.responses && data.responses.length > 0) {
      return data.responses[0].text || data.responses[0].message || 'I received your message.';
    }
    
    return data.text || 'I received your message.';
  } catch (error) {
    console.error('Botpress error:', error);
    return handleSimpleBot(message, config.knowledgeBase);
  }
}

/**
 * Google Gemini integration
 * Documentation: https://ai.google.dev/docs
 * Free tier: High limits, $0 cost
 */
async function handleGemini(
  message: string,
  config: ChatbotConfig,
  conversationId?: string
): Promise<string> {
  if (!config.apiKey) {
    console.error('Gemini: Missing apiKey');
    return handleSimpleBot(message, config.knowledgeBase);
  }

  try {
    // Build system instruction with knowledge base if available
    let systemInstruction = config.config?.systemPrompt || 'You are a helpful customer support assistant for a business. Be friendly, concise, and accurate.';
    
    // If knowledge base exists, prepend it to system instruction
    if (config.knowledgeBase) {
      systemInstruction = `${systemInstruction}\n\nKnowledge Base:\n${config.knowledgeBase}\n\nUse the knowledge base above to answer questions accurately. If the information is not in the knowledge base, politely say you don't have that information and suggest contacting support directly.`;
    }

    // Use Gemini API via server proxy or direct API call
    const model = config.config?.model || 'gemini-1.5-flash';
    
    // Try to use server proxy first (if available), otherwise use direct API
    let apiUrl: string;
    let headers: Record<string, string>;
    let body: any;

    // Check if we have a server proxy endpoint
    const useProxy = window.location.hostname !== 'localhost' || import.meta.env.VITE_USE_GEMINI_PROXY === 'true';
    
    if (useProxy) {
      // Use server proxy (recommended for production)
      apiUrl = '/api/gemini';
      headers = {
        'Content-Type': 'application/json',
      };
      body = {
        model: model,
        contents: [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: config.config?.temperature || 0.7,
          topK: config.config?.topK || 40,
          topP: config.config?.topP || 0.95,
          maxOutputTokens: config.config?.maxTokens || 500,
        }
      };
    } else {
      // Direct API call (for development)
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;
      headers = {
        'Content-Type': 'application/json',
      };
      body = {
        contents: [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: config.config?.temperature || 0.7,
          topK: config.config?.topK || 40,
          topP: config.config?.topP || 0.95,
          maxOutputTokens: config.config?.maxTokens || 500,
        }
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Extract response text from Gemini API response
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }
    
    return 'I received your message.';
  } catch (error) {
    console.error('Gemini error:', error);
    return handleSimpleBot(message, config.knowledgeBase);
  }
}

