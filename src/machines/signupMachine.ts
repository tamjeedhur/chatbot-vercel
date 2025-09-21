import { assign, fromPromise, setup } from "xstate";
import axiosInstance from "../lib/axiosInstance";

const signupMachine = setup({
  actors: {
    signUpRequest: fromPromise(
      async ({ input }: { input: { email: string; password: string } }) => {
        try {
          const response = await axiosInstance.post("/api/auth/signup", input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          return { message: response.data.message };
        } catch (error: any) {
          if (error.response && error.response.data) {
            // Handle the nested error structure
            const errorMessage = error.response.data.error?.message || error.response.data.message || error.message;
            throw new Error(errorMessage);
          }
          throw new Error(error.message);
        }
      }
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwJZQHYFcAOA6FEANmAMQDKAqgEICyAkgCoDaADALqKjYD2qALim7pOIAB6IAjAGYWuAKwtFiqQDZVAJgkB2ABwAaEAE9EATgAsudQpYSzOljrlaWmgL6uDqDDlyFuAQwgUdCgSCCEwfHQAN24Aa0ivLDw-QOCoBGDYgGN-ASFWNkKRHn5BYSQxRDMtFVwtCR0tOSspORMJE30jRB0JeSUWZscJFR0VOXdPNGTfAKCQkjAAJ2XuZdxsQjyAM3WAW1wkn1SFjKzuXPz0QuLK0pRrkXEEGrqGppa5No6ug2MENoLCZvhIFGoHHIVCCpiBjngVmtliRRLA+HlIv4dnwVgAKdRKACUJHhuER6zuXF4j3Kz0QcihuDMtiGEhYJg5LDMZn+iHUYyZLBU6hMqlqcjMLRU7g8IHQ3AgcBE8JK1KelReAFoVLyENrcINDYatLDSQRiKqykI6a91LqJFZcPYOepVFytG0tOpTTMTvN0paadaNXy5P0Plo7FYdK65N0AeZLPyoVpzPYVJ0zD7vHhYJhstk4PB7mraSGECpU7gxs0ha6bCodT1AS4kxNatIGsyJdnZuTloH1aAXpWTNXPnWZKMmwCCep5NIhvZ1NzK04Za4gA */
  id: "signup",
  initial: "idle",
  context: {
    errorMsg: null,
    isLoading: false,
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
        src: "signUpRequest",
        input: ({ event }) => ({
          email: event.email,
          password: event.password,
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
      type: "final",
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

export default signupMachine;
