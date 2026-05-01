'use client';

import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from '@/components/ui/sidebar';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Moon, Sun, User, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import UsageCreditProgress from './UsageCreditProgress';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import moment from 'moment';
import Link from 'next/link';

const AppSidebar = () => {

  const { theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<any>([]);
  const { user } = useUser();

  const getChatHistory = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) return;
    const q = query(collection(db, "chatHistory"), where("userEmail", '==', userEmail));
    const querySnapsShot = await getDocs(q);
    const chats: any[] = [];
    querySnapsShot.forEach((doc) => {
      chats.push(doc.data());
    });
    setChatHistory(chats);
  };
  const getLastUserMessage =  (chat: any) => {
   
      const allMessages = Object.values(chat?.messages).flat();
      const userMessages: any = allMessages.filter((msg: any) => msg.role === 'user');
      const lastUserMsg = userMessages[userMessages.length - 1]?.content || null;
      const lastUpdated = chat.lastUpdated || Date.now();
      const formatDate = moment(lastUpdated).fromNow();
      return {
        chatId: chat.chatId,
        message: lastUserMsg,
        lastUpdated: formatDate
      }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getChatHistory();
    }
  }, [user?.primaryEmailAddress?.emailAddress]);


  return (
     <Sidebar>
      <SidebarHeader>
        <div className='p-3'>
          <div className=' flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <Image src={"/logo.svg"}  alt='logo' width={60} height={60} className='w-[40px] h-[40px] '/>
              <h2 className='font-bold text-xl'>AI Nexus</h2>
            </div>
            <div>
                { mounted && ( theme === 'light' ?  <Button variant={'ghost'} onClick={() => setTheme('dark')}><Moon/></Button> :   <Button variant={'ghost'} onClick={() => setTheme('light')}><Sun/></Button> )}
            </div>
          </div>
          <Link href={'/'}>
            {user ? 
              <Button className='mt-7 w-full cursor-pointer'>+ New Chat</Button>
              : <SignInButton mode='modal'>
                  <Button className='mt-7 w-full'>Sign In</Button>
                </SignInButton>  
          }
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='p-3'>
          <div className='p-3'>
            <h2 className='font-bold text-lg'>Chat</h2>
            {!user && <p className='text-sm text-gray-500'>Sign in to chat mutiple ai models</p>}
            {chatHistory.map((chat: any, idx: number) => {
            const lastUserMsgObj = getLastUserMessage(chat);
            const lastMsg = lastUserMsgObj.message;
            return (
              <Link href={'?chat='+chat.chatId} key={idx} className='mt-3 cursor-pointer'>
                <div className='flex justify-between items-center hover:bg-gray-400 rounded-lg p-3 transition-all duration-200'>
                  <h2 className='text-lg line-clamp-1'>{lastMsg ? lastMsg : <span className='text-gray-400'>No messages</span>}</h2>
                  <h2 className='text-sm text-gray-700'>{getLastUserMessage(chat).lastUpdated}</h2>
                  <hr className='my-3'/>
                </div>
              </Link>
            );
          })}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className='p-3 mb-8 cursor-pointer'>
         {!user ? <SignInButton mode='modal'>
            <Button className='w-full' size={'lg'}>Sign In / Sign Up</Button>
          </SignInButton> : 
          <div>
            <UsageCreditProgress/>
            <Button className='w-full mb-3'>
               <Zap/>
               Upgrade your plan
            </Button>
         <Button className='flex w-full' variant={'ghost'}>
            <User/>
            <h2>Settings</h2>
         </Button>
          </div>
          }
         
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
