import { assign, fromPromise, setup } from "xstate";
import axiosInstance from "../lib/axiosInstance";

const resetPasswordMachine = setup({
  actors: {
    resetPasswordRequest: fromPromise(
      async ({ input }: { input: { email: string } }) => {
        try {
          const response = await axiosInstance.post(
            "/api/reset-password",
            input,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          return { message: response.data.message };
        } catch (error: any) {
          if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
          }
          throw new Error(error.message);
        }
      }
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCc5gC4AUCGtYHcB7ZCAOgEsIAbMAYgGUBVAIQFkBJAFQG0AGAXUSgADoVjl05QgDshIAB6IAzAHYATKQAcARjUBWJbz3aVelToA0IAJ6ITAFlIBOA7r0Bfd1dSwMOPEQkpFSE2BDk0lC0EDJgFNIAboQA1nE+frgExGQhYRFQCBFJAMbYkjJ8-JVyouLlskgKyupabobGpubaVrYIOqQeXiDpWJmBOaHhkbRgyMjEpMJUZQBmxAC2pCP+WUG5UwVFhKX1ldWNtRJSDaCKfU4qA12aAGy8SsZ6L2o9di9KpHeL3sek0SnBEKU9k83jQowC2VIsAArsVinBYLR5LB0GU4tgVuhZgAKNS8ckASlo2zGiJRaIx5xEYiuMjkd20L20gKUTl4KgFoPMfJevwQSm0jj0Tn+ensnJeipeKhhwzhO3GpFm82QWJxeNIBKJyFJ5N4VJpCKC2uITJAl3q7LsvDUjnB0qcmgMn2+YqUZNIJhlmlMniG0kIEDgcktuwgNRZjsadwAtKKbIg06rY5rKDQE3Vrk6EGpNG62kYTGZLBnxUoXk81E4FUrFSqhjnEft8gXWTcmghvo4gypwWoVP9lT9a5zucZDGSwZCodn1bSgvT0Xhe0nboh7NPev7NKR7JoXEvl6pV754XGtXNiDui8m7JLHm8nCDdE5eSClH6UKAuozatkq7aeEAA */
  id: "resetPassword",
  initial: "idle",
  context: {
    errorMsg: null,
    isLoading: false,
    successMsg: null,
  },
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: "loading",
          actions: assign({
            isLoading: () => true,
            errorMsg: () => null,
          }),
        },
      },
    },
    loading: {
      invoke: {
        src: "resetPasswordRequest",
        input: ({ event }) => ({
          email: event.email,
        }),
        onDone: {
          target: "success",
          actions: assign({
            isLoading: () => false,
            errorMsg: () => null,
          }),
        },
        onError: {
          target: "error",
          actions: assign({
            isLoading: () => false,
            errorMsg: ({ event }) => {
              return event.error;
            },
          }),
        },
      },
    },
    success: {
      after: {
        2000: {
          target: "idle",
          actions: assign({
            successMsg: () => null,
          }),
        },
      },
    },
    error: {
      after: {
        2000: {
          target: "idle",
          actions: assign({
            errorMsg: () => null,
          }),
        },
      },
    },
  },
});

export default resetPasswordMachine;
