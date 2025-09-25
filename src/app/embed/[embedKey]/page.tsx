import ChatbotComponent from './ChatbotComponent';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import './widget.css';

// Server Component - runs on server, no flicker
export default async function EmbedPage({ params }: { params: { embedKey: string } }) {
  const { embedKey } = params;

  // Split embedKey into widgetKey and chatbotId
  const [widgetKey, chatbotId] = embedKey.split('_');

  if (!widgetKey || !chatbotId) {
    notFound(); // Shows 404 page for invalid embed keys
  }

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || (process.env.NODE_ENV === 'production' ? 'https://chatbot-be-production.up.railway.app' : 'http://localhost:3005');

    const response = await fetch(`${apiUrl}/api/v1/widget/embed/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embedKey,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to validate embedKey:', response.status, response.statusText);
      notFound(); // Shows 404 page for invalid embed keys
    }

    const validationData = await response.json();
    if (!validationData.success || !validationData.data.valid) {
      console.error('Invalid embedKey:', embedKey);
      notFound();
    }
    console.log('validationData', JSON.stringify(validationData, null, 2));
    const { chatbot, config: backendConfig } = validationData.data;

    // Check if widget is enabled
    if (!chatbot.widget?.enabled || !backendConfig.widget?.enabled) {
      return (
        <div className='flex items-center justify-center h-full'>
          <div className='text-center p-6'>
            <div className='text-yellow-500 text-4xl mb-4'>🔧</div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Widget Disabled</h3>
            <p className='text-sm text-gray-600'>This chatbot widget is currently disabled by the administrator.</p>
          </div>
        </div>
      );
    }

    // Check if chatbot is active
    if (chatbot.status !== 'active') {
      return (
        <div className='flex items-center justify-center h-full'>
          <div className='text-center p-6'>
            <div className='text-gray-500 text-4xl mb-4'>⏸️</div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Chatbot Inactive</h3>
            <p className='text-sm text-gray-600'>This chatbot is currently {chatbot.status || 'inactive'}.</p>
          </div>
        </div>
      );
    }
    console.log('backendConfig', JSON.stringify(backendConfig, null, 2));
    // Transform complete backend config to frontend format
    const config = {
      chatbotId,
      widgetKey,
      name: chatbot.name || 'AI Chat Assistant',
      description: chatbot.description || '',
      ui: {
        theme: backendConfig.ui?.theme || 'light',
        primaryColor: backendConfig.ui?.primaryColor || '#007bff',
        botColor: backendConfig.ui?.botColor || '#007bff',
        userMessageColor: backendConfig.ui?.userMessageColor || '#007bff',
        botMessageColor: backendConfig.ui?.botMessageColor || '#007bff',
        position: backendConfig.ui?.position || 'bottom-right',
        displayName: backendConfig.ui?.displayName || chatbot.name || 'AI Assistant',
        messagePlaceholder: backendConfig.ui?.messagePlaceholder || 'Type your message…',
        suggestedMessages: backendConfig.ui?.suggestedMessages || [],
        logoUrl: backendConfig.ui?.logoUrl,
        customCss: backendConfig.ui?.customCss,
      },

      // Chat Settings from backend
      settings: {
        welcomeMessage: backendConfig.ui?.welcomeMessage || backendConfig.settings?.welcomeMessage || 'Hello! How can I help you today?',
        aiChat: backendConfig.settings?.aiChat !== false,
        popupMessage: backendConfig.settings?.popupMessage,
        fallbackResponse: backendConfig.settings?.fallbackResponse || 'I apologize, but I cannot help with that request.',
        maxMessagesPerConversation: backendConfig.settings?.maxMessagesPerConversation || 50,
        autoEscalateThreshold: backendConfig.settings?.autoEscalateThreshold,
        collectFeedback: backendConfig.settings?.collectFeedback !== false,
        allowRegenerate: backendConfig.settings?.allowRegenerate !== false,
        workingHours: backendConfig.settings?.workingHours,

        // Theme settings for compatibility
        theme: {
          primaryColor: backendConfig.ui?.primaryColor || '#007bff',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },

      // Model Configuration
      model: {
        systemPrompt: backendConfig.model?.systemPrompt,
        intentModel: backendConfig.model?.intentModel,
        responseModel: backendConfig.model?.responseModel,
        temperature: backendConfig.model?.temperature || 0.7,
        maxTokens: backendConfig.model?.maxTokens || 1000,
        topP: backendConfig.model?.topP || 0.7,
        frequencyPenalty: backendConfig.model?.frequencyPenalty || 1,
        topK: backendConfig.model?.topK || 50,
      },

      // Behavior Policies
      behaviorPolicies: {
        bannedTopics: backendConfig.behaviorPolicies?.bannedTopics || [],
        requiredDisclaimers: backendConfig.behaviorPolicies?.requiredDisclaimers || [],
        politenessLevel: backendConfig.behaviorPolicies?.politenessLevel || 'professional',
      },

      // Tools and Features
      tools: backendConfig.tools || [],
      escalationThreshold: backendConfig.escalationThreshold || 0.6,

      // Routing Configuration
      routing: {
        escalationEnabled: backendConfig.routing?.escalationEnabled !== false,
        strategy: backendConfig.routing?.strategy || 'round_robin',
        defaultPriority: backendConfig.routing?.defaultPriority || 'normal',
      },

      // Widget-specific settings
      widget: {
        enabled: backendConfig.widget?.enabled !== false,
        allowAnonymous: backendConfig.widget?.allowAnonymous !== false,
        allowedOrigins: backendConfig.widget?.allowedOrigins || [],
        autoShowDelay: backendConfig.widget?.autoShowDelay || 5,
        aiChatEnabled: backendConfig.widget?.aiChatEnabled !== false,
        keyPermissions: backendConfig.widget?.keyPermissions || ['chat', 'read'],
      },

      // Socket configuration - uses environment variables
      socketUrl:
        process.env.NEXT_PUBLIC_SOCKET_URL || (process.env.NODE_ENV === 'production' ? 'wss://your-api-domain.com' : 'http://localhost:3005'),
    };

    return (
      <div className='widget-embed-container h-full w-full bg-white' style={{ width: '100%', height: '100%' }}>
        <ChatbotComponent config={config} widgetKey={widgetKey} chatbotId={chatbotId} />
      </div>
    );
  } catch (error) {
    console.error('Error loading chatbot configuration:', error);

    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-center p-6 max-w-sm'>
          <div className='text-red-500 text-4xl mb-4'>⚠️</div>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>Widget Unavailable</h3>
          <p className='text-sm text-gray-600 mb-4'>Unable to load the chatbot configuration. This may be due to:</p>
          <ul className='text-xs text-gray-500 text-left space-y-1'>
            <li>• Widget key has expired</li>
            <li>• Chatbot is currently disabled</li>
            <li>• Network connectivity issues</li>
            <li>• Server maintenance</li>
          </ul>
          <p className='text-xs text-gray-400 mt-4'>Please contact the website owner if this issue persists.</p>
        </div>
      </div>
    );
  }
}

// Generate metadata for widget iframe
export async function generateMetadata() {
  return {
    title: 'Chatbot Widget',
    robots: 'noindex', // Prevent indexing of embed pages
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    other: {
      'Content-Security-Policy': 'frame-ancestors *', // Allow embedding in iframes
    },
  };
}
