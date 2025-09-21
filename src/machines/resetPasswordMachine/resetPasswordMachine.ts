import {assign, setup,fromPromise } from "xstate";
import { ResetPasswordContext, ResetPasswordEvent } from "./types";
import axiosInstance from "@/lib/axiosInstance";
import { API_VERSION } from "@/utils/constants";
import { extractErrorMessage } from "@/utils/utils";
import { toast } from 'sonner';

export const resetPasswordMachine = setup({
  types: {} as {
    context: ResetPasswordContext;
    events: ResetPasswordEvent;
    input: ResetPasswordContext;
  },
  actors:{
    updatePassword: fromPromise(async ({ input }: { input: { password: string, token: string } }) => {
      try {
        const response = await axiosInstance.post(`/api/${API_VERSION}/auth/reset-password`, {
          password: input.password,
          token:input.token
        });
        return response.data;
      } catch (error: any) {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
      }
    }),
  },
  actions: {
    // Success toast actions using API response message
    showSuccessToast: ({ event }: any) => {
      const message = event.output?.message || 'Password reset successfully';
      toast.success(message);
    },
    showErrorToast: ({ event }: any) => {
      const message = event.error?.message || 'An error occurred';
      toast.error(message);
    },
    setErrorWithToast: assign({
      error: ({ event }: any) => {
        const errorMessage = event.error?.message || 'An error occurred';
        // Show toast notification for error
        toast.error(errorMessage);
        return errorMessage;
      },
    }),
  },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QCc5gC4AUCGtYHcB7ZCAOkgEt0KA7KAYgGUBVAIQFkBJAFQG0AGALqJQAB0KwqFQjREgAHogDM-AEykAbKoAsATl0bt-XQA4TAVgCMAdgA0IAJ6JV1k6V38tBpZe0nd1hoAvkH2qLAYOHhEJOQQUnT0AKIAIjwA+pgAgoyMAOoA8gBKKQLCSCDiktQycooIJvyk5koeWpY+Sv5KSvZOCDbW7i2WGp6+qj7WIWFoWLgExGSU1ImpGQDCBQByAGKcReyZOfnFpUJyVVK1FfXaqn2IJpbN-G86uh3mGuYm2jMgcKRBYxMiwACuACMALZUVYMCAyMCkWgAN0IAGtkUD5tElqQITC4bQoAg0YQAMbYGo0MplS4Sa6yW6IH5uEY6SxmczfVQPRzOHqaXnPFyuSwBf6hQFzKKLWKE2HoeH0MDIZDEUiiAA21IAZsRoaQcXLQQSoUr4WSaOiqTS6RcKlcaXVWb9mj5Odzefz+qpdNphVoTNZrH5+J6QtKaIQIHA5CaQUsGdVpMzQPUALQaR4IbMAxN42IrEkppmugaqJqWGxc6wBkw+APaXMuXSkIxeDQ+PwBYLSwvysEW4l0MsulkIe5KUh-JRhswaRvWPmtnnuTxKf0GH5vDT92YRXFD80UilweBOxkTjNPawvCUtfgtDShjzmVs+DueVSNmzc-gTAPGUj1NfE1Q1ZBxzTCsQwfXQnxfN9n1bXR1E7X8DD0H8eijIIgA */
    id: 'resetPassword',
    initial: 'editing',
    context: ({ input }) => ({
        password: '',
        confirmPassword:'',
        token: input?.token || '',
        error: null,
    }),
    states: {
        editing: {
            on: {
                SUBMIT: [
                    {
                        guard: ({ context }) => context.password === context.confirmPassword && context.password !== '',
                        target: 'submitting'
                    }
                ],
                EDIT_PASSWORD: {
                    actions: assign({
                        password: ({ event }) => event.password
                    })
                },
                EDIT_CONFIRM_PASSWORD: {
                    actions: assign({
                        confirmPassword: ({ event }) => event.confirmPassword
                    })
                }
            },
        },
        submitting: {
            invoke: {
                src: 'updatePassword',
                input: ({ context }: { context: ResetPasswordContext }) => ({
                    password: context.password || '',
                    token: context.token || ''
                }),
                onDone: {
                    target: 'success',
                    actions: [
                        assign({
                            error: null,
                        }),
                        'showSuccessToast'
                    ]
                },
                onError: {
                    target: 'error',
                    actions: 'setErrorWithToast'
                }
            }
        },
        success: {
            after: {
                2000: { target: 'redirecting' }
            }
        },
        redirecting: {
            type: 'final'
        },
        error: {
            type: 'final'
        }
    },
}

);

export default resetPasswordMachine;