"use client"

import React, { useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./_components/AppSidebar"
import Appheader from "./_components/Appheader"
import { useUser } from "@clerk/nextjs"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/config/firebase"

export function ThemeProvider({  children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {

  const { user } = useUser();

  const createNewUser = async () => {
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress!);
    const userSnap = await getDoc(userRef)
    if(userSnap.exists()) return;
    const userData = {
      name: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      createdAt: new Date(),
      remainingMsg: 10,
      plan: 'Free',
      credits: 1000
    }
    await setDoc(userRef, userData)
  };

  useEffect(() => {
    if(user){
      createNewUser();
    }
  },[user])

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