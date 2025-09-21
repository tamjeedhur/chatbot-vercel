import React, { createContext, useContext, useEffect } from "react";
import { useMachine } from "@xstate/react";
import authMachine, { IAuthMachineContext } from "../machines/authMachine";
import { fromPromise } from "xstate";
import axiosInstance from "@/lib/axiosInstance";
import { getSession, signIn, useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/interfaces";
import { useRouter, usePathname } from "next/navigation";

const AuthMachineContext = createContext<any>({});

// Create the provider component
export const AuthMachineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const clientSession = useSession();
  const authService = useMachine(
    authMachine.provide({
      actors: {
        signInRequest: fromPromise(
          async ({ input }: { input: { email: string; password: string } }) => {
            try {
              const result = await signIn("credentials", {
                email: input.email,
                password: input.password,
                redirect: false,
              });

              if (!result?.ok) {
                if (result?.error) {
                  throw new Error(result?.error);
                }
              }

              const session = (await getSession()) as ExtendedSession;

              if (!session?.user?.accessToken && !session?.accessToken) {
                throw new Error("No tokens found in session");
              }
              // Get chatbots from session to determine redirect path
              const chatbots = session?.chatbots;
              
              if (chatbots && chatbots.length > 0) {
                // Redirect to the zero-indexed chatbot's dashboard
                const firstChatbot = chatbots[0];
                const chatbotName = firstChatbot.name || firstChatbot.displayName || 'dashboard';
                router.push(`/${chatbotName}/dashboard`);
              } else {
                // No chatbots, redirect to create chatbot page
                router.push("/create-chatbot");
              }
              router.refresh();

              return {
                accessToken: session?.user?.accessToken,
                refreshToken: session?.user?.refreshToken,
              };
            } catch (error: any) {
              throw new Error(error.message);
            }
          }
        ),
        signInSSORequest: fromPromise(
          async ({ input }: { input: { provider: string } }) => {
            try {
              const result = await signIn("google", {
                redirect: false,
              });
              if (result?.error) {
                throw new Error(result.error);
              }
              // popupCenter("/google-signin", "Sample Sign In")
              return true;
            } catch (error: any) {
              throw new Error(error.message);
            }
          }
        ),
        refreshTokenRequest: fromPromise(
          async ({ input }: { input: IAuthMachineContext }) => {
            try {
              const response = await axiosInstance.post(
                "/api/auth/refresh-token",
                { refreshToken: input.refreshToken },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              return {
                accessToken: response.data.token,
                refreshToken: response.data.refreshToken,
              };
            } catch (error: any) {
              if (error.response && error.response.data) {
                throw new Error(error.response.data.message);
              }
              throw new Error(error.message);
            }
          }
        ),
        validateTokenRequest: fromPromise(
          async ({ input }: { input: IAuthMachineContext }) => {
            try {
              const response = await axiosInstance.get("/api/validate-token", {
                headers: {
                  Authorization: `Bearer ${input.accessToken}`,
                },
              });
              return response.data;
            } catch (error: any) {
              throw new Error(error.response?.data?.message || error.message);
            }
          }
        ),
      },
    })
  );

  const [, send] = authService;

  // Hydrate auth state from session when component mounts
  useEffect(() => {
    if (clientSession.data) {
      const hydrateAuthState = async () => {
        try {
          const session = (await getSession()) as ExtendedSession;
          if (session?.user?.accessToken || session?.accessToken) {
            send({
              type: "VALIDATE_TOKEN",
              accessToken: session?.user?.accessToken || session?.accessToken,
              refreshToken:
                session?.user?.refreshToken || session?.refreshToken,
            });
          }
        } catch (error) {
          console.error("Error hydrating auth state:", error);
        }
      };

      hydrateAuthState();
    }
  }, [clientSession.data, pathname]);

  return (
    <AuthMachineContext.Provider value={{ authService }}>
      {children}
    </AuthMachineContext.Provider>
  );
};

// Create a custom hook for using the auth machine
export const useAuthMachine = () => {
  const { authService } = useContext(AuthMachineContext);
  const [state, send, service] = authService;

  return { state, send, service };
};
