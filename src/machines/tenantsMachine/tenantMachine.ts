import { setup, assign, fromPromise } from "xstate";
import axiosInstance from "@/lib/axiosInstance";
import {
  Tenant,
  TenantResponse,
  setTenant,
  setTenantsMembers,
  addTenantAPIKey,
  addTenantsMembers,
  removeTenantAPIKey,
  updateTenantAPIKey,
  updateSettingsAndSecurity,
  APIKey,
  removeTenantsMembers,
} from "@/redux/slices/tenantSlice";
import { API_VERSION } from "@/utils/constants";
import { extractErrorMessage } from "@/utils/utils";
import {
  TenantMachineInput,
  TenantMachineContext,
  TenantMachineEvents,
} from "./types";
import { set, cloneDeep } from "lodash";
import { toast } from "sonner";
import { store } from "@/redux/store";

// API Actors with proper error handling
const updateTenantActor = fromPromise(
  async ({
    input,
  }: {
    input: { tenantId: string; updates: Partial<Tenant> };
  }) => {
    try {
      const { updates } = input;
      const response = await axiosInstance.put(
        `/api/${API_VERSION}/tenants/settings`,
        updates
      );
      return response.data as TenantResponse;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  }
);

const getTenantActor = fromPromise(async () => {
  try {
    const response = await axiosInstance.get(
      `/api/${API_VERSION}/tenants/settings`
    );
    return response.data as TenantResponse;
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    throw new Error(errorMessage);
  }
});

const inviteMemberActor = fromPromise(
  async ({
    input,
  }: {
    input: { email: string; role: string; message: string };
  }) => {
    try {
      const { email, role, message } = input;
      const response = await axiosInstance.post(
        `/api/${API_VERSION}/tenants/users/invite`,
        {
          email: email,
          role: role,
          message: message,
        }
      );
      return response.data as any;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  }
);

const deleteMemberActor = fromPromise(
  async ({ input }: { input: { invitationId: string } }) => {
    try {
      const { invitationId } = input;
      const response = await axiosInstance.delete(
        `/api/${API_VERSION}/tenants/users/${invitationId}`
      );
      return response.data as any;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  }
);

const createAPIKeyActor = fromPromise(
  async ({ input }: { input: { name: string; permissions: string[] } }) => {
    try {
      const { name, permissions } = input;
      const response = await axiosInstance.post(
        `/api/${API_VERSION}/tenants/api-keys`,
        {
          name,
          permissions,
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  }
);

const deleteAPIKeyActor = fromPromise(
  async ({ input }: { input: { keyId: string } }) => {
    try {
      const { keyId } = input;
      const response = await axiosInstance.delete(
        `/api/${API_VERSION}/tenants/api-keys/${keyId}`
      );
      return response.data as any;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  }
);

const revokeAPIKeyActor = fromPromise(
  async ({ input }: { input: { keyId: string } }) => {
    try {
      const { keyId } = input;
      const response = await axiosInstance.patch(
        `/api/${API_VERSION}/tenants/api-keys/${keyId}/revoke`
      );
      return response.data as any;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  }
);

const tenantMachine = setup({
  types: {} as {
    input: TenantMachineInput;
    context: TenantMachineContext;
    events: TenantMachineEvents;
  },
  actors: {
    updateTenant: updateTenantActor,
    getTenant: getTenantActor,
    inviteMember: inviteMemberActor,
    deleteMember: deleteMemberActor,
    createAPIKey: createAPIKeyActor,
    deleteAPIKey: deleteAPIKeyActor,
    revokeAPIKey: revokeAPIKeyActor,
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
        const errorMessage = event.error?.message || "An error occurred";
        toast.error(errorMessage);
        return errorMessage;
      },
    }),
    clearError: assign({
      error: null,
    }),
    updateTenantData: assign({
      tenant: ({ event }: any) => event.output.data,
    }),
    updateSettingsAndSecurity: assign({
      tenant: ({ context, event }: any) => {
        if (!context.tenant || !event.output?.data) {
          return context.tenant;
        }

        // Extract data from API response and merge with existing tenant
        const apiResponse = event.output.data;
        const updatedTenant = { ...context.tenant };

        // Merge settings if they exist in the response
        if (apiResponse.settings) {
          updatedTenant.settings = {
            ...context.tenant.settings,
            ...apiResponse.settings,
          };
        }

        // Merge security if it exists in the response
        if (apiResponse.security) {
          updatedTenant.security = {
            ...context.tenant.security,
            ...apiResponse.security,
          };
        }

        // Handle top-level fields
        if (apiResponse.ipWhitelist !== undefined) {
          updatedTenant.ipWhitelist = apiResponse.ipWhitelist;
        }
        if (apiResponse.sessionTimeout !== undefined) {
          updatedTenant.sessionTimeout = apiResponse.sessionTimeout;
        }

        return updatedTenant;
      },
    }),
    updateMembersData: assign({
      members: ({ event }: any) => event.output.data || event.output,
    }),
    resetState: assign({
      isLoading: false,
      error: null,
    }),
    // Success actions with toast notifications using API message
    setSuccessWithToast: assign({
      isLoading: false,
      error: null,
    }),
    updateTenantSuccess: assign({
      tenant: ({ event }: any) => event.output.data,
    }),
    updateMembersSuccess: assign({
      members: ({ event }: any) => event.output.data || event.output,
    }),
    inviteMemberSuccess: assign({
      isLoading: false,
      error: null,
      members: ({ context, event }: any) => {
        // Add the new invitation to the members list
        const newInvitation = event.output?.data;
        if (newInvitation) {
          return [...context.members, newInvitation];
        }
        return context.members;
      },
    }),
    // Success toast actions using API response message
    showSuccessToast: ({ event }: any) => {
      const message =
        event.output?.message || "Operation completed successfully";
      toast.success(message);
    },
    showErrorToast: ({ event }: any) => {
      const message = event.error?.message || "An error occurred";
      toast.error(message);
    },

    addAPIKey: assign({
      apiKeys: ({ context, event }: any) => {
        const response = event.output;
        let newAPIKey = null;

        if (response?.data?.apiKey) {
          newAPIKey = response.data.apiKey;
        } else if (response?.data) {
          newAPIKey = response.data;
        } else if (response?.apiKey) {
          newAPIKey = response.apiKey;
        } else if (response) {
          newAPIKey = response;
        }

        if (newAPIKey) {
          const updatedAPIKeys = [...context.apiKeys, newAPIKey];
          // Sync with Redux store
          store.dispatch(addTenantAPIKey(newAPIKey));

          return updatedAPIKeys;
        }
        return context.apiKeys;
      },
    }),

    removeAPIKey: assign({
      apiKeys: ({ context, event }: any) => {
        const keyId = event.keyId;
        const updatedAPIKeys = context.apiKeys.filter(
          (key: APIKey) => key.id !== keyId
        );
        // Sync with Redux store
        store.dispatch(removeTenantAPIKey(keyId));
        return updatedAPIKeys;
      },
    }),

    updateAPIKeyStatus: assign({
      apiKeys: ({ context, event }: any) => {
        const { keyId, isActive } = event;
        const updatedAPIKeys = context.apiKeys.map((key: APIKey) =>
          key.id === keyId ? { ...key, isActive } : key
        );
        // Sync with Redux store
        store.dispatch(updateTenantAPIKey({ keyId, updates: { isActive } }));
        return updatedAPIKeys;
      },
    }),
    storeDeletingInvitationId: assign({
      deletingInvitationId: ({ event }: any) => event.invitationId
    }),
    removeMember: assign({
      members: ({ context }: any) => {
        // Get invitationId from the context where we stored it
        const invitationId = context.deletingInvitationId;
        if (!invitationId) {
          console.error('No invitationId found in context');
          return context.members;
        }
        const updatedMembers = context.members.filter(
          (member: any) => member.invitationId !== invitationId
        );
        store.dispatch(removeTenantsMembers(invitationId));
        return updatedMembers;
      },
    }),
  },
  guards: {
    hasUpdates: ({ event }: any) => {
      if (event.type !== "UPDATE_TENANT") return false;
      return Object.keys(event.updates).length > 0;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBcwDsCGbkFkMGMALASzTADoAbAewwlKhzAFsAjMAJ1gGIJqzypAG7UA1hVSZseIqQo06DJm06wEw6vgzJi-ANoAGALqGjiUAAdqsYjv7mQAD0QAmABwBOci4AsH-wDsLgDMHgBsAKxubgA0IACeiG4AjOQRBhnBbgFuYQYeATkAvkVxkli4BCQCCvRojCzsXNycHNQc5BaU2gBm7czk5dJVclS0dQ0qXOpoIlp2aKamDlY2Cw7OCO5evv4FIeFRsQmuLgHkwREel2HBLsnBydnBJWXoFTLVFMQQlGDcAFUAAoAEQAggAVACiAH1oQA5MHwiHLJAgVa2XRoDauTzePyBA6RaJxRIINzpchuHzBMJuUK3DwGHwBV4gIaVWQCH5-QGgyGwhFIlHJMxojHrNGbIJefLBAIRKIGFwFAI+UmIZIsgzkGlPDzJDwREJ0iJsjmfUY8-7A8HQmEAMQAklCADIg1GWayY+xSxABI1UjzU0JudxPEIahAPHxucjKiJhFwuOkGALBAwvUrs97DLnfX42-n251ukEwpHlgDKYIAalDPejvZLQJtgrGLgrmck1e2ohEo8ktTrkonDUmwmEA6PzbnOV9BIXuE74bWnfacFCcAAhKEAJUbEqxOIQPkNVOSLgil-ukQCYWSg5S52HAUzt2vPjN2YtI25S5BN0oQ3LddwPYwVmbY8-VPS9dXlWMfGVfxHgMMIo3uNDdQiO5R2uNxMxcWcpHnK0lwAYVdKEwT3GF9z3AB5cCxS9NZoNbf1wnIMIkIfalrkvMNByvFx4yCPwk3pS5r2Ij4-wLXkqwATXhci4ShRFkUPKDfQ4hAAx8chCnbYJLljaJLkHS8vEnCcrh8HxiTCWS8wXa1uD3KEq2A7S2N0pwkmSHUPBVSd-AMCIz3VE5o0zYIjIeB4jRZdw7hc0j-15V0GLBcswSBJ0YQAaShJSq18n1sRgnxk3ja4cgDM5fCiDDaS8R4U1uEIr1CLM3hIy1Mv+cjPIFCsCuK0qKpbALYPi9IMjPbJ8jpNUMOJbir3ye8wmSvqcwG+TF15QCqPtfLCpKpTpvY2azwiXU6QI9wrjVZJ0JilUWXIer7wiN8z3CHx0sGhT-k82sGJK8bLqmiDxR0qq9LPUTM0vf6Ah7N8DGOMlLyTNIk0cxUshqgoQaO2oGF4fhvlmMQJDnUGxkUeoZjmbQsSWeHWMqk9tnxPYggZI4ozuHUOvSPw0PpbJgZ-JnKfGanWnaTpumQPoOAGX98xZiZ2c0Tn9GMG7-M2AXdkJEWSRivxRKTBaavtni0wpvWAFcLAgTn6hp7l6fEQZFc973fagQ35i502eabPykdmy2CX2G3ccQfs0hyIdQgMJ4au-fq5NDn2dD91WOi6Xp+mDw7i-DyPjcWGOWLjvmYKToWiVFmKFXOTwIt7bOUyIhXa4XL2S4YB1iDASgIDBNAICrDAhGpvgA5EIPdfHsPS6gafZ-nxfl9XtmNCjk2TFjo9zdxHZk+Fw5bbJfxDNCgicciVbWVHoud8n+oB854LyXivFWHA2gVw1lrHWId-7hyAUfUBp8I7n0btzFuN8E4WzxFbFOT804ICZKkEyu1LyJXyMkd2blZiYnqMoJo-s6ab0ZmPK0tC94MM4A3BYGDILx35rgh+Xdn6ah4oZMMYYaTJkTA+AuB0-7sNXpwxonAWgQLVpXTW1dt5KLoZMJoPDo5X0wYjQR99O6p0HIqVI2RrymX+hmek1DRgQFnmAFRUwmGCEDqwxRAg3F-E8YYtBvDm78LbnpDu1sCFPinNxJCmMcYhgki4gJ7jglqPLurKu2sa7+IoIEjxShVEcCMZfM22C76CxicSQhLhc7zQyEFSSkUcLyN0TUZW9QLpFTAPEHg69mEM3ya5UYVMekFT6QM8pTcTERJmjgixtTu5knuImH6OFkyPGyCafanT5DdKgL0-pPBslaJgaMjKhzWbHKmac2ZfCEYCPbkIyxsTPpnDCBcK4oQcixkNF+NJFB8AcDAOHE58RvEaC3nA0YoLwV70hY88JzzImJzeSs0RWxAYXhTADZ8NIf6FzGQIBFEL7lQvOdAnRcKyVgopU6aZKL5losWdUvBj86kYUTA9KcDS6nuBZM5X+pLCkZIYJC6FvirnMyKUiylLLKnmJqfg7ln03xeHRkFPwTw1TEoUWK8g8rJWUvUZAnJ2i8kHONRKyZTL+lKuvmY15yy1WrNxJFH61Iv4RXej2DpdKKBgs3qah1UKhk+JYbKo6IaxBhuZaE4xyrXWqq5R66Mjx4poV8EEBqtwaTAvIHG0QCb+nms0TS61Qbi1gFDfaxN9ML5zJTVEzF7rsVaiiD9ZMypQgNKlj-bMaBqBuPgGiA5CzbqbAALQfTJHOotEyDGqCnbfBAPE0iS1zWcY0wYrKpHvBmfFkVP6RCLdaNdVTyS0ipESnGpkAzMnnZqf6JCKS53pH4XsIqSXXP1gwK9J4AydgWitcKY4xa3CpMqB9hRqQqjcEWie4cgMwW7bnRMGZMwEWiAaAcMVGTcTlOkNUudMyBrYQIFDe9EEgJPoBtl07EA1SjCFUShpjQ0hwqOL8BqbXCH0VwjgaG9LdsxnYzwdk0IBGsUEIynUKSeFHJxotJr6GlNE7NHC5AexPApA5W4bVZMxUNDjXUX5Qj-WvEaJdRzIXjt5uy-SolEy7Bwp4LIaYX1bDzluh4tIHyFAir+w1-7yUKvDVpzYeRM4pCeFkRMS1ggYUcjqILDjojuHTCPP9cq7V3Ki0x9dD54yOwTDkCKvgMJqi8CFcKxJrziSLSWstZInPMYQN2njV5pwPgyBSHz6N4p6rPOmAoSUSglCAA */
  id: "tenantMachine",
  initial: "idle",
  context: ({ input }) => ({
    tenant: input.tenant,
    tenantId: input.tenantId,
    error: null,
    isLoading: false,
    members: [],
    apiKeys: [],
  }),
  states: {
    idle: {
      on: {
        UPDATE_TENANT: [
          {
            guard: "hasUpdates",
            target: "updating",
          },
          {
            actions: "clearError",
          },
        ],
        UPDATE_FIELD: {
          actions: [
            assign({
              tenant: ({ context, event }) => {
                const base = (event as any).base || context.tenant;
                if (!base) return null;
                const updatedTenant = cloneDeep(base);
                set(updatedTenant, event.path, event.value);
                return updatedTenant;
              },
            }),
            ({ context }) => {
              if (context.tenant) {
                const updatedTenant = context.tenant;
                store.dispatch(setTenant(updatedTenant));
              }
            },
          ],
        },
        UPDATE_FIELD_AND_SAVE: {
          target: "updatingFieldAndSaving",
          actions: [
            assign({
              tenant: ({ context, event }) => {
                const base = (event as any).base || context.tenant;
                if (!base) return null;
                const updatedTenant = cloneDeep(base);
                set(updatedTenant, event.path, event.value);
                return updatedTenant;
              },
              error: () => null,
            }),
            ({ context }) => {
              if (context.tenant) {
                const updatedTenant = context.tenant;
                store.dispatch(setTenant(updatedTenant));
              }
            },
          ],
        },
        INVITE_MEMBER: {
          target: "invitingMember",
        },
        DELETE_MEMBER: {
          target: "deletingMember",
        },
        CLEAR_ERROR: {
          actions: "clearError",
        },
        SYNC_TENANT: {
          actions: [
            assign({
              tenant: ({ event }) => event.data,
              error: () => null,
            }),
            ({ event }) => {
              if (event.data) {
                store.dispatch(setTenant(event.data));
              }
            },
          ],
        },
        RESET: {
          actions: "resetState",
        },
        CREATE_API_KEY: {
          target: "creatingAPIKey",
        },
        DELETE_API_KEY: {
          target: "deletingAPIKey",
        },
        REVOKE_API_KEY: {
          target: "revokingAPIKey",
        },
      },
    },
    loading: {
      entry: "setLoading",
      invoke: {
        src: "getTenant",
        input: ({ context }: { context: TenantMachineContext }) => ({
          tenantId: context.tenant.id,
        }),
        onDone: {
          target: "idle",
          actions: [
            "setSuccess",
            "updateTenantData",
            ({ event }) => {
              if (event.output?.data) {
                store.dispatch(setTenant(event.output.data));
              }
            },
            "showSuccessToast",
          ],
        },
        onError: {
          target: "idle",
          actions: "setError",
        },
      },
    },
    updating: {
      entry: "setLoading",
      invoke: {
        src: "updateTenant",
        input: ({
          context,
          event,
        }: {
          context: TenantMachineContext;
          event: TenantMachineEvents;
        }) => ({
          tenantId: context.tenant.id,
          updates: event.type === "UPDATE_TENANT" ? event.updates : {},
        }),
        onDone: {
          target: "idle",
          actions: [
            "setSuccess",
            "updateSettingsAndSecurity",
            ({ event }) => {
              if (event.output?.data) {
                // Extract data from API response and update Redux store
                const apiResponse = event.output.data;
                store.dispatch(
                  updateSettingsAndSecurity({
                    settings: apiResponse.settings,
                    security: apiResponse.security,
                    ipWhitelist: apiResponse.ipWhitelist,
                    sessionTimeout: apiResponse.sessionTimeout,
                  })
                );
              }
            },
            "showSuccessToast",
          ],
        },
        onError: {
          target: "idle",
          actions: "setError",
        },
      },
    },
    updatingFieldAndSaving: {
      invoke: {
        src: "updateTenant",
        input: ({ context }) => {
          if (!context.tenant) {
            throw new Error("No current tenant provided");
          }
          return {
            tenantId: context.tenant.id,
            updates: context.tenant,
          };
        },
        onDone: {
          target: "idle",
          actions: [
            "updateSettingsAndSecurity",
            assign({
              isLoading: false,
              error: null,
            }),
            ({ event }) => {
              if (event.output?.data) {
                // Extract data from API response and update Redux store
                const apiResponse = event.output.data;
                store.dispatch(
                  updateSettingsAndSecurity({
                    settings: apiResponse.settings,
                    security: apiResponse.security,
                    ipWhitelist: apiResponse.ipWhitelist,
                    sessionTimeout: apiResponse.sessionTimeout,
                  })
                );
              }
            },
            "showSuccessToast",
          ],
        },
        onError: {
          target: "idle",
          actions: assign({
            error: ({ event }) => {
              const errorMessage =
                (event.error as Error).message || "Failed to update tenant";
              // Show toast notification for error
              toast.error(errorMessage);
              return errorMessage;
            },
            isLoading: false,
          }),
        },
      },
    },
    invitingMember: {
      invoke: {
        src: "inviteMember",
        input: ({
          context,
          event,
        }: {
          context: TenantMachineContext;
          event: any;
        }) => ({
          email: event.email,
          role: event.role,
          message: event.message,
        }),
        onDone: {
          target: "idle",
          actions: [
            "setSuccess",
            "inviteMemberSuccess",
            ({ event }) => {
              if (event.output?.data) {
                const newInvitation = event.output.data;
                store.dispatch(addTenantsMembers([newInvitation]));
              }
            },
            "showSuccessToast",
          ],
        },
        onError: {
          target: "idle",
          actions: "setError",
        },
      },
    },
    deletingMember: {
      entry: ["setLoading", "storeDeletingInvitationId"],
      invoke: {
        src: "deleteMember",
        input: ({
          context,
          event,
        }: {
          context: TenantMachineContext;
          event: any;
        }) => ({
          invitationId: event.invitationId,
        }),
        onDone: {
          target: "idle",
          actions: [
            "setSuccess",
            "removeMember",
            "showSuccessToast",
          ],
        },
        onError: {
          target: "idle",
          actions: "setError",
        },
      },
    },
    creatingAPIKey: {
      entry: "setLoading",
      invoke: {
        src: "createAPIKey",
        input: ({
          context,
          event,
        }: {
          context: TenantMachineContext;
          event: any;
        }) => ({
          name: event.name,
          permissions: event.permissions,
          expiresAt: event.expiresAt,
        }),
        onDone: {
          target: "idle",
          actions: ["setSuccess", "addAPIKey", "showSuccessToast"],
        },
        onError: {
          target: "idle",
          actions: "setError",
        },
      },
    },
    deletingAPIKey: {
      entry: "setLoading",
      invoke: {
        src: "deleteAPIKey",
        input: ({
          context,
          event,
        }: {
          context: TenantMachineContext;
          event: any;
        }) => ({
          keyId: event.keyId,
        }),
        onDone: {
          target: "idle",
          actions: ["setSuccess", "removeAPIKey", "showSuccessToast"],
        },
        onError: {
          target: "idle",
          actions: "setError",
        },
      },
    },
    revokingAPIKey: {
      entry: "setLoading",
      invoke: {
        src: "revokeAPIKey",
        input: ({
          context,
          event,
        }: {
          context: TenantMachineContext;
          event: any;
        }) => ({
          keyId: event.keyId,
        }),
        onDone: {
          target: "idle",
          actions: [
            "setSuccess",
            assign({
              apiKeys: ({ context, event }: any) => {
                const keyId = event.keyId;
                const updatedAPIKeys = context.apiKeys.map((key: APIKey) =>
                  key.id === keyId ? { ...key, isActive: false } : key
                );
                // Sync with Redux store
                store.dispatch(
                  updateTenantAPIKey({ keyId, updates: { isActive: false } })
                );
                return updatedAPIKeys;
              },
            }),
            "showSuccessToast",
          ],
        },
        onError: {
          target: "idle",
          actions: "setError",
        },
      },
    },
  },
});

export default tenantMachine;
