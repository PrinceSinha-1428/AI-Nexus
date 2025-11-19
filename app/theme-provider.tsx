"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./_components/AppSidebar"
import Appheader from "./_components/Appheader"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
  {...props}>
    <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <Appheader/>
        {children}
        </div>
    </SidebarProvider>
    </NextThemesProvider>
}