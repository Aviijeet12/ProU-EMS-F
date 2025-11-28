import "./globals.css";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import {ThreeBackground} from "@/components/three-background";

import { AuthProvider } from "@/context/auth-context";
import { DataProvider } from "@/context/data-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Employee Task Manager",
  description: "Manage employees and tasks",
};

import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased relative`}>
        {/* Background (your original UI effect) */}
        <ThreeBackground />

        {/* Theme + Providers */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
