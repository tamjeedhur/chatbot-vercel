import React from "react";
import { Providers } from "@/components/providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { CustomSession } from "@/types/interfaces";
import { getTheme } from "@/app/actions/theme";
import { ThemeScript } from "@/app/theme-script";
import "../styles/globals.css"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const theme = await getTheme();
  
  return (
    <html lang="en" className={theme} suppressHydrationWarning style={{overflowX: "hidden"}}>
      <body>
        <ThemeScript />
        <Providers session={session} theme={theme}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
