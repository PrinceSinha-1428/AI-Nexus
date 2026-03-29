"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import Appheader from "./_components/Appheader";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import {
  AIModelContext,
  DefaultModelType,
  MessagesType,
} from "@/context/AIModelContext";
import { DefaultModel } from "@/shared/AiModels";
import { UserDetailContext } from "@/context/UserDetailContext";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const { user } = useUser();
  const [aiSelectedModel, setAiSelectedModel] =
    useState<DefaultModelType>(DefaultModel);
  const [userDetails, setUserDetails] = useState<any>({});
  const [messages, setMessages] = useState<MessagesType>({});

  const createNewUser = async () => {
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress!);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userInfo = userSnap.data();
      setAiSelectedModel(userInfo.selectedModelPref ?? DefaultModel);
      setUserDetails(userInfo);
      return;
    } else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg: 10,
        plan: "Free",
        credits: 1000,
      };
      await setDoc(userRef, userData);
      setUserDetails(userData);
    }
  };

  const updateAIModelSelection = async () => {
    const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress as string);
    await updateDoc(docRef, { selectedModelPref: aiSelectedModel });
  };

  useEffect(() => {
    if (user) {
      createNewUser();
    }
  }, [user]);

  useEffect(() => {
    if (aiSelectedModel && user?.primaryEmailAddress?.emailAddress) {
      updateAIModelSelection();
    }
  }, [aiSelectedModel]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <AIModelContext.Provider
          value={{ aiSelectedModel, setAiSelectedModel, messages, setMessages }}
        >
          <SidebarProvider>
            <AppSidebar />
            <div className="w-full">
              <Appheader />
              {children}
            </div>
          </SidebarProvider>
        </AIModelContext.Provider>
      </UserDetailContext.Provider>
    </NextThemesProvider>
  );
}
