import { setup, assign, fromPromise } from 'xstate';
import { toast } from 'sonner';
import { GeneralSettingsData, WorkspaceFormState, PreferencesFormState, Tenant, TenantSettings, SettingsError } from '@/types/settings';

// Types
export interface GeneralSettingsInput {
  initialData: GeneralSettingsData;
  tenantId: string;
  accessToken: string;
}

export interface GeneralSettingsContext {
  tenant: Tenant;
  settings: TenantSettings;
  isLoading: boolean;
  error: SettingsError | null;
  hasChanges: boolean;
  workspaceForm: WorkspaceFormState;
  preferences: PreferencesFormState;
  accessToken: string;
}

export type GeneralSettingsEvents =
  | { type: 'UPDATE_WORKSPACE_FIELD'; field: keyof GeneralSettingsContext['workspaceForm']; value: string }
  | { type: 'UPDATE_PREFERENCE'; field: keyof GeneralSettingsContext['preferences']; value: boolean }
  | { type: 'SAVE_WORKSPACE' }
  | { type: 'SAVE_PREFERENCES' }
  | { type: 'RESET_FORM' }
  | { type: 'CLEAR_ERROR' };

// Client-side API call with token
const updateTenantSettingsActor = fromPromise(async ({ input }: { input: { tenantId: string; updates: any; accessToken: string } }) => {
  try {
    const response = await fetch('/api/settings/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${input.accessToken}`,
      },
      body: JSON.stringify(input.updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update settings');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating settings:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update settings');
  }
});

// Machine
export const generalSettingsMachine = setup({
  types: {
    input: {} as GeneralSettingsInput,
    context: {} as GeneralSettingsContext,
    events: {} as GeneralSettingsEvents,
  },
  actors: {
    updateTenantSettings: updateTenantSettingsActor,
  },
  actions: {
    setLoading: assign({
      isLoading: true,
      error: null,
    }),
    setSuccess: assign({
      isLoading: false,
      error: null,
    }),
    setError: assign({
      isLoading: false,
      error: ({ event }: any) => {
        const errorMessage = event.error?.message || 'An error occurred';
        const error: SettingsError = {
          message: errorMessage,
          code: event.error?.code || 'UNKNOWN_ERROR',
        };
        toast.error(errorMessage);
        return error;
      },
    }),
    clearError: assign({
      error: null,
    }),
    updateWorkspaceField: assign({
      workspaceForm: ({ context, event }: any) => ({
        ...context.workspaceForm,
        [event.field]: event.value,
      }),
      hasChanges: true,
    }),
    updatePreference: assign({
      preferences: ({ context, event }: any) => ({
        ...context.preferences,
        [event.field]: event.value,
      }),
      hasChanges: true,
    }),
    saveWorkspaceSuccess: assign({
      tenant: ({ event }: any) => event.output.data,
      hasChanges: false,
    }),
    savePreferencesSuccess: assign({
      tenant: ({ event }: any) => event.output.data,
      hasChanges: false,
    }),
    resetForm: assign({
      workspaceForm: ({ context }) => ({
        name: context.tenant?.settings?.workspace?.name || '',
        url: context.tenant?.settings?.workspace?.url || '',
        description: context.tenant?.settings?.workspace?.description || '',
      }),
      preferences: ({ context }) => ({
        emailNotifications: context.tenant?.settings?.notifications?.email?.newTeamMember || false,
        publicWorkspace: context.tenant?.settings?.workspace?.isPublic || false,
      }),
      hasChanges: false,
      error: null,
    }),
    showSuccessToast: () => {
      toast.success('Settings updated successfully');
    },
  },
  guards: {
    hasWorkspaceChanges: ({ context }) => {
      const current = context.workspaceForm;
      const original = {
        name: context.tenant?.settings?.workspace?.name || '',
        url: context.tenant?.settings?.workspace?.url || '',
        description: context.tenant?.settings?.workspace?.description || '',
      };
      return JSON.stringify(current) !== JSON.stringify(original);
    },
    hasPreferenceChanges: ({ context }) => {
      const current = context.preferences;
      const original = {
        emailNotifications: context.tenant?.settings?.notifications?.email?.newTeamMember || false,
        publicWorkspace: context.tenant?.settings?.workspace?.isPublic || false,
      };
      return JSON.stringify(current) !== JSON.stringify(original);
    },
  },
}).createMachine({
  id: 'generalSettings',
  initial: 'idle',
  context: ({ input }) => ({
    tenant: input.initialData.tenant,
    settings: input.initialData.settings,
    isLoading: false,
    error: null,
    hasChanges: false,
    accessToken: input.accessToken,
    workspaceForm: {
      name: input.initialData.tenant?.settings?.workspace?.name || '',
      url: input.initialData.tenant?.settings?.workspace?.url || '',
      description: input.initialData.tenant?.settings?.workspace?.description || '',
    },
    preferences: {
      emailNotifications: input.initialData.tenant?.settings?.notifications?.email?.newTeamMember || false,
      publicWorkspace: input.initialData.tenant?.settings?.workspace?.isPublic || false,
    },
  }),
  states: {
    idle: {
      on: {
        UPDATE_WORKSPACE_FIELD: {
          actions: 'updateWorkspaceField',
        },
        UPDATE_PREFERENCE: {
          actions: 'updatePreference',
        },
        SAVE_WORKSPACE: [
          {
            guard: 'hasWorkspaceChanges',
            target: 'savingWorkspace',
          },
          {
            actions: 'clearError',
          },
        ],
        SAVE_PREFERENCES: [
          {
            guard: 'hasPreferenceChanges',
            target: 'savingPreferences',
          },
          {
            actions: 'clearError',
          },
        ],
        RESET_FORM: {
          actions: 'resetForm',
        },
        CLEAR_ERROR: {
          actions: 'clearError',
        },
      },
    },
    savingWorkspace: {
      entry: 'setLoading',
      invoke: {
        src: 'updateTenantSettings',
        input: ({ context }) => ({
          tenantId: context.tenant.id,
          accessToken: context.accessToken,
          updates: {
            settings: {
              ...context.tenant.settings,
              workspace: {
                ...context.tenant.settings.workspace,
                ...context.workspaceForm,
              },
            },
          },
        }),
        onDone: {
          target: 'idle',
          actions: ['setSuccess', 'saveWorkspaceSuccess', 'showSuccessToast'],
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
    savingPreferences: {
      entry: 'setLoading',
      invoke: {
        src: 'updateTenantSettings',
        input: ({ context }) => ({
          tenantId: context.tenant.id,
          accessToken: context.accessToken,
          updates: {
            settings: {
              ...context.tenant.settings,
              notifications: {
                ...context.tenant.settings.notifications,
                email: {
                  ...context.tenant.settings.notifications?.email,
                  newTeamMember: context.preferences.emailNotifications,
                },
              },
              workspace: {
                ...context.tenant.settings.workspace,
                isPublic: context.preferences.publicWorkspace,
              },
            },
          },
        }),
        onDone: {
          target: 'idle',
          actions: ['setSuccess', 'savePreferencesSuccess', 'showSuccessToast'],
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
  },
});
