'use client';

import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from '@/components/ui/sidebar';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Moon, Sun, User, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import UsageCreditProgress from './UsageCreditProgress';

const AppSidebar = () => {

  const { theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);


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
          <div>
            {user ? 
              <Button className='mt-7 w-full'>+ New Chat</Button>
              : <SignInButton mode='modal'>
                  <Button className='mt-7 w-full'>Sign In</Button>
                </SignInButton>  
          }
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='p-3'>
          <div className='p-3'>
            <h2 className='font-bold text-lg'>Chat</h2>
            {!user && <p className='text-sm text-gray-500'>Sign in to chat mutiple ai models</p>}
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
