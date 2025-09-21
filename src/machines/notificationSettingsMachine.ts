import { setup, assign, fromPromise } from 'xstate';

// Types
interface NotificationSettings {
  email: {
    newTeamMember: boolean;
    billingUpdates: boolean;
    securityAlerts: boolean;
    weeklyUsageReports: boolean;
  };
  inApp: {
    realTimeUpdates: boolean;
    soundNotifications: boolean;
  };
}

interface NotificationSettingsInput {
  initialSettings: NotificationSettings;
  tenantId: string;
  serverUrl: string;
  bearerToken: string;
}

interface NotificationSettingsContext {
  settings: NotificationSettings;
  tenantId: string;
  serverUrl: string;
  bearerToken: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

type NotificationSettingsEvents = { type: 'UPDATE_NOTIFICATION'; path: string; value: boolean } | { type: 'SAVE_SETTINGS' } | { type: 'RESET_ERROR' };

// Actions will be defined inline in the machine setup

// Guards
const hasChanges = ({ context }: { context: NotificationSettingsContext }) => {
  // For now, we'll always allow saving since we're updating immediately
  return true;
};

// Actors
const saveNotificationSettings = fromPromise(
  async ({ input }: { input: { settings: NotificationSettings; tenantId: string; serverUrl: string; bearerToken: string } }) => {
    const { settings, tenantId, serverUrl, bearerToken } = input;

    const response = await fetch(`${serverUrl}/api/v1/tenants/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        notifications: settings,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update notification settings: ${response.statusText}`);
    }

    return response.json();
  }
);

// Machine
export const notificationSettingsMachine = setup({
  types: {
    input: {} as NotificationSettingsInput,
    context: {} as NotificationSettingsContext,
    events: {} as NotificationSettingsEvents,
  },
  actors: {
    saveNotificationSettings,
  },
  actions: {
    updateNotification: assign({
      settings: ({ context, event }) => {
        if (event.type !== 'UPDATE_NOTIFICATION') return context.settings;

        const newSettings = { ...context.settings };
        const pathParts = event.path.split('.');

        if (pathParts.length === 3) {
          const [category, subcategory, setting] = pathParts;
          if (newSettings[category as keyof NotificationSettings] && typeof newSettings[category as keyof NotificationSettings] === 'object') {
            (newSettings[category as keyof NotificationSettings] as any)[setting] = event.value;
          }
        }

        return newSettings;
      },
    }),
    setLoading: assign({
      status: 'loading',
      error: null,
    }),
    setSuccess: assign({
      status: 'success',
      error: null,
    }),
    setError: assign({
      status: 'error',
      error: ({ event }) => {
        if ('error' in event && event.error && typeof event.error === 'object' && 'message' in event.error) {
          return (event.error as { message: string }).message || 'Failed to update settings';
        }
        return 'Failed to update settings';
      },
    }),
    clearError: assign({
      error: null,
    }),
  },
  guards: {
    hasChanges,
  },
}).createMachine({
  id: 'notificationSettings',
  initial: 'idle',
  context: ({ input }) => ({
    settings: input.initialSettings,
    tenantId: input.tenantId,
    serverUrl: input.serverUrl,
    bearerToken: input.bearerToken,
    status: 'idle',
    error: null,
  }),
  states: {
    idle: {
      on: {
        UPDATE_NOTIFICATION: {
          actions: 'updateNotification',
        },
        SAVE_SETTINGS: {
          guard: 'hasChanges',
          target: 'saving',
        },
        RESET_ERROR: {
          actions: 'clearError',
        },
      },
    },
    saving: {
      entry: 'setLoading',
      invoke: {
        src: 'saveNotificationSettings',
        input: ({ context }) => ({
          settings: context.settings,
          tenantId: context.tenantId,
          serverUrl: context.serverUrl,
          bearerToken: context.bearerToken,
        }),
        onDone: {
          target: 'idle',
          actions: 'setSuccess',
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
  },
});
