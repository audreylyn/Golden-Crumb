/**
 * Chatbot Service
 * Handles integration with various chatbot providers
 * Each website can have its own chatbot configuration
 */

import { supabase, getWebsiteId } from './supabase';

export type ChatbotProvider = 'simple' | 'botpress' | 'dialogflow' | 'openai' | 'custom';

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

    return {
      provider: (data.chatbot_provider as ChatbotProvider) || 'simple',
      apiKey: data.chatbot_api_key || undefined,
      botId: data.chatbot_bot_id || undefined,
      webhookUrl: data.chatbot_webhook_url || undefined,
      config: (data.chatbot_config as Record<string, any>) || {},
      knowledgeBase: data.knowledge_base || undefined,
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
    
    case 'dialogflow':
      return handleDialogflow(message, config, conversationId);
    
    case 'openai':
      return handleOpenAI(message, config, conversationId);
    
    case 'custom':
      return handleCustomWebhook(message, config, conversationId);
    
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
 * Dialogflow (Google) integration
 * Documentation: https://cloud.google.com/dialogflow/es/docs
 */
async function handleDialogflow(
  message: string,
  config: ChatbotConfig,
  conversationId?: string
): Promise<string> {
  if (!config.botId || !config.apiKey) {
    console.error('Dialogflow: Missing botId or apiKey');
    return handleSimpleBot(message, config.knowledgeBase);
  }

  try {
    // Dialogflow API endpoint
    const projectId = config.botId; // In Dialogflow, botId is the project ID
    const apiUrl = `https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${conversationId || 'default'}:detectIntent`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        queryInput: {
          text: {
            text: message,
            languageCode: config.config?.languageCode || 'en',
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Dialogflow API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.queryResult && data.queryResult.fulfillmentText) {
      return data.queryResult.fulfillmentText;
    }
    
    return 'I received your message.';
  } catch (error) {
    console.error('Dialogflow error:', error);
    return handleSimpleBot(message, config.knowledgeBase);
  }
}

/**
 * OpenAI GPT integration
 * Documentation: https://platform.openai.com/docs/guides/chat
 */
async function handleOpenAI(
  message: string,
  config: ChatbotConfig,
  conversationId?: string
): Promise<string> {
  if (!config.apiKey) {
    console.error('OpenAI: Missing apiKey');
    return handleSimpleBot(message, config.knowledgeBase);
  }

  try {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    
    // Build system prompt with knowledge base if available
    let systemPrompt = config.config?.systemPrompt || 'You are a helpful customer support assistant for a business.';
    
    // If knowledge base exists, prepend it to system prompt
    if (config.knowledgeBase) {
      systemPrompt = `${systemPrompt}\n\nKnowledge Base:\n${config.knowledgeBase}\n\nUse the knowledge base above to answer questions accurately. If the information is not in the knowledge base, politely say you don't have that information and suggest contacting support directly.`;
    }
    
    // Get conversation history if available (you might want to store this)
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt,
      },
      {
        role: 'user' as const,
        content: message,
      },
    ];

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.config?.model || 'gpt-3.5-turbo',
        messages: messages,
        temperature: config.config?.temperature || 0.7,
        max_tokens: config.config?.maxTokens || 150,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    
    return 'I received your message.';
  } catch (error) {
    console.error('OpenAI error:', error);
    return handleSimpleBot(message, config.knowledgeBase);
  }
}

/**
 * Custom webhook integration
 */
async function handleCustomWebhook(
  message: string,
  config: ChatbotConfig,
  conversationId?: string
): Promise<string> {
  if (!config.webhookUrl) {
    console.error('Custom webhook: Missing webhookUrl');
    return handleSimpleBot(message, config.knowledgeBase);
  }

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        message: message,
        conversationId: conversationId,
        timestamp: new Date().toISOString(),
        knowledgeBase: config.knowledgeBase,
        ...config.config,
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Expect webhook to return { text: "response" } or { message: "response" }
    return data.text || data.message || 'I received your message.';
  } catch (error) {
    console.error('Custom webhook error:', error);
    return handleSimpleBot(message, config.knowledgeBase);
  }
}

