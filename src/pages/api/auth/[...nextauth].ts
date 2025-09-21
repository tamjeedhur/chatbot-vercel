import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { CustomUser, CustomSession, CustomToken } from "@/types/interfaces";
import { API_VERSION } from "@/utils/constants";

// Verify required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "NEXTAUTH_SECRET is not set. Please add it to your environment variables."
  );
}

// Set NEXTAUTH_URL if not provided
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';
}

// NextAuth configuration with type annotations
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Add cookie configuration
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "accessToken", type: "text" },
        refreshToken: { label: "refreshToken", type: "text" },
        id: { label: "id", type: "text" },
        name: { label: "name", type: "text" },
        user: { label: "user", type: "text" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        console.log("this is the credentials before if", credentials);
        if (credentials?.accessToken && credentials?.id) {
          let parsedUser = JSON.parse(credentials?.user || '{}');
          return {
            id: credentials.id,
            email: parsedUser.email || credentials.email,
            name: parsedUser.name || credentials.name,
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
            user: parsedUser,
          } as CustomUser;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      try {
       
        if (user) {
          
          if (account?.provider === "google") {
            const apiUrl = `${process.env.SERVER_URL}/api/${API_VERSION}/auth/oauth/login`
            const res = await fetch(
              apiUrl,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  provider: "google",
                  accessToken: account.access_token
                }),
              }
            );

            const data = await res.json();
            
            if (res.ok && data.success && data.data?.accessToken) {
              return {
                ...token,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                userId: data.data.user?.id,
                user: data.data.user,
                accessTokenExpires: Date.now() + (data.data.expiresIn || 900) * 1000,
              };
            } else {
              console.error("❌ Backend call failed:", data);
            }
          } else if (account?.provider === "credentials") {
            const customUser = user as CustomUser;
            return {
              ...token,
              accessToken: customUser.accessToken,
              refreshToken: customUser.refreshToken,
              userId: customUser.id,
              user: customUser.user,
              accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
            };
          }
        }
        return token;
      } catch (e) {
        console.log("JWT callback error:", e);
        return token;
      }
    },
    
    async session({ session, token }): Promise<CustomSession> {
      // Add custom properties to session
      const customSession = {
        ...session,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        userId: token.userId as string,
        user: {
          ...session.user,
          ...(token.user as any),
        }
      } as CustomSession;
      return customSession;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);