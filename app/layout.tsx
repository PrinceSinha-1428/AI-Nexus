import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { ClerkProvider} from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Nexus",
  description: "Multi Model AI SaaS application",
  icons: {
    icon: "/logo.svg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
   <html lang="en" suppressHydrationWarning>
        <head />
        <body suppressHydrationWarning>
          <ThemeProvider
            
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
      </ClerkProvider>

  );
}
