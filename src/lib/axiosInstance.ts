import axios from "axios";
import { Server_URL } from "@/utils/constants";
import { getSession } from "next-auth/react";
import { ExtendedSession } from "@/types/interfaces";

// Create a base axios instance
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: Server_URL,
  });

  // Add request interceptor
  instance.interceptors.request.use(
    async (config) => {
      if (typeof window !== "undefined") {
        // Client-side: try to get token from session
        try {
          const session = (await getSession()) as ExtendedSession | null;
          const accessToken = session?.accessToken;

          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        } catch (error) {
          console.warn("Failed to get session token:", error);
        }
      }

      config.headers["Content-Type"] = "application/json";
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export the base instance for server-side usage
const axiosInstance = createAxiosInstance();

export default axiosInstance;
