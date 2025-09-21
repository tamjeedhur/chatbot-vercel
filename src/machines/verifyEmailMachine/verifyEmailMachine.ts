import { createMachine,fromPromise,setup } from "xstate";
import { VerifyEmailContext, VerifyEmailEvent } from "./types";
import axiosInstance from "@/lib/axiosInstance";
import { API_VERSION } from "@/utils/constants";
import { extractErrorMessage } from "@/utils/utils";
import { toast } from 'sonner';
import { assign } from "xstate";

export const verifyEmailMachine = setup({
    types: {} as {
        context: VerifyEmailContext;
        events: VerifyEmailEvent;
        input: VerifyEmailContext;
    },
    actors: {
        verifyEmail: fromPromise(async ({ input }: { input: { token: string } }) => {
            try {
                const response = await axiosInstance.post(`/api/${API_VERSION}/auth/verify-email`, {
                    token: input.token,
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
            const message = event.output?.message || 'Email verified successfully';
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
    /** @xstate-layout N4IgpgJg5mDOIC5QDcwCcCWAzAngUQFsBDDAGwDpVNcMA7KAYggHtaxy7lmBrdq7fMTKV0AulASdmAYyIAXDKwDaABgC6qtYlAAHZrAwLW2kAA9EAJgAsK8gDYAjAHZnVhwGYnAVi8AOAJwWADQgOIj+DuTeKjFOKla+DlbuDv4Avmkh-LiEJBTZOOIM6GjMaOQ6pPJYZQQi1IJ59WL0krRcska0mpomegZdJuYI1raOLk5unj4BwaGIDl4WUV4xKqtek07uSxmZILTMEHAmBblkffqGirRDiAC0diFhCI8ZWaI5QhQYEKRglwGNzuCH8-nIMz8gU2Fncvl8cxeDl8TnIaxU1isdisTjs6ys7xAZ2+zRo9EB12MSDMiCsiMQiQh6Oc8QRFl8XkJxKasAArtJpHB4NT+pTbtThm5URYHCoIl4djZVk95ggAkyYrL2XZfCp3HYuZ9GsISmUKYMJbTnOQZXLFor1ioVUjVhqYgj-I53O50nsgA */
    id: 'verifyEmail',
    initial: 'verifying',
    context: ({ input }) => ({
        token: input?.token || '',
        error: null,
    }),
    states: {
        verifying: {
            invoke: {
                src: 'verifyEmail',
                input: ({ context }) => ({ token: context.token }),
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
            type: 'final',
        },
        error: {
            type: 'final',
        }
    }
})