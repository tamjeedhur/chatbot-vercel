import { setup, assign, fromPromise } from 'xstate';
import { Server_URL, API_VERSION } from '@/utils/constants';

// Types
export interface Member {
  id: string;
  invitationId: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'User' | 'Guest';
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InviteMemberData {
  email: string;
  role: string;
  message?: string;
}

export interface MembersMachineInput {
  initialMembers: Member[];
  serverUrl: string;
  bearerToken: string;
}

export interface MembersMachineContext {
  members: Member[];
  loading: boolean;
  error: string | null;
  serverUrl: string;
  bearerToken: string;
}

export type MembersMachineEvents =
  | { type: 'LOAD_MEMBERS' }
  | { type: 'INVITE_MEMBER'; data: InviteMemberData }
  | { type: 'DELETE_MEMBER'; invitationId: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'REFRESH' };

// API Actors
const loadMembersActor = fromPromise(async ({ input }: { input: { serverUrl: string; bearerToken: string } }) => {
  const { serverUrl, bearerToken } = input;

  // Get fresh token from session if not provided
  let token = bearerToken;
  if (!token && typeof window !== 'undefined') {
    // This will be handled by the component
    throw new Error('No bearer token available');
  }

  const response = await fetch(`${serverUrl}/api/${API_VERSION}/tenants/members`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load members: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || [];
});

const inviteMemberActor = fromPromise(async ({ input }: { input: { serverUrl: string; bearerToken: string; data: InviteMemberData } }) => {
  const { serverUrl, bearerToken, data } = input;

  // Get fresh token from session if not provided
  let token = bearerToken;
  if (!token && typeof window !== 'undefined') {
    throw new Error('No bearer token available');
  }

  const response = await fetch(`${serverUrl}/api/${API_VERSION}/tenants/users/invite`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to invite member: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || result;
});

const deleteMemberActor = fromPromise(async ({ input }: { input: { serverUrl: string; bearerToken: string; invitationId: string } }) => {
  const { serverUrl, bearerToken, invitationId } = input;

  // Get fresh token from session if not provided
  let token = bearerToken;
  if (!token && typeof window !== 'undefined') {
    throw new Error('No bearer token available');
  }

  const response = await fetch(`${serverUrl}/api/${API_VERSION}/tenants/users/${invitationId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete member: ${response.statusText}`);
  }

  return { success: true };
});

// Machine
export const membersMachine = setup({
  types: {
    input: {} as MembersMachineInput,
    context: {} as MembersMachineContext,
    events: {} as MembersMachineEvents,
  },
  actors: {
    loadMembers: loadMembersActor,
    inviteMember: inviteMemberActor,
    deleteMember: deleteMemberActor,
  },
  actions: {
    setLoading: assign({
      loading: true,
      error: null,
    }),
    setSuccess: assign({
      loading: false,
      error: null,
    }),
    setError: assign({
      loading: false,
      error: ({ event }: any) => event.error?.message || 'An error occurred',
    }),
    clearError: assign({
      error: null,
    }),
    updateMembers: assign({
      members: ({ event }: any) => event.output || [],
    }),
    addMember: assign({
      members: ({ context, event }: any) => {
        const newMember = event.output;
        if (newMember) {
          return [...context.members, newMember];
        }
        return context.members;
      },
    }),
    removeMember: assign({
      members: ({ context, event }: any) => {
        const invitationId = event.invitationId;
        return context.members.filter((member: Member) => member.invitationId !== invitationId);
      },
    }),
  },
  guards: {
    hasMembers: ({ context }: any) => context.members.length > 0,
    canInvite: ({ event }: any) => {
      const data = event.data;
      return data?.email && data?.role;
    },
  },
}).createMachine({
  id: 'membersMachine',
  initial: 'idle',
  context: ({ input }) => ({
    members: input.initialMembers,
    loading: false,
    error: null,
    serverUrl: input.serverUrl,
    bearerToken: input.bearerToken,
  }),
  states: {
    idle: {
      on: {
        LOAD_MEMBERS: 'loading',
        INVITE_MEMBER: {
          guard: 'canInvite',
          target: 'inviting',
        },
        DELETE_MEMBER: 'deleting',
        CLEAR_ERROR: {
          actions: 'clearError',
        },
        REFRESH: 'loading',
      },
    },
    loading: {
      entry: 'setLoading',
      invoke: {
        src: 'loadMembers',
        input: ({ context }) => ({
          serverUrl: context.serverUrl,
          bearerToken: context.bearerToken,
        }),
        onDone: {
          target: 'idle',
          actions: ['setSuccess', 'updateMembers'],
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
    inviting: {
      entry: 'setLoading',
      invoke: {
        src: 'inviteMember',
        input: ({ context, event }) => {
          if (event.type !== 'INVITE_MEMBER') {
            throw new Error('Invalid event type for invite member');
          }
          return {
            serverUrl: context.serverUrl,
            bearerToken: context.bearerToken,
            data: event.data,
          };
        },
        onDone: {
          target: 'idle',
          actions: ['setSuccess', 'addMember'],
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
    deleting: {
      entry: 'setLoading',
      invoke: {
        src: 'deleteMember',
        input: ({ context, event }) => ({
          serverUrl: context.serverUrl,
          bearerToken: context.bearerToken,
          invitationId: event.type === 'DELETE_MEMBER' ? event.invitationId : '',
        }),
        onDone: {
          target: 'idle',
          actions: ['setSuccess', 'removeMember'],
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
  },
});
