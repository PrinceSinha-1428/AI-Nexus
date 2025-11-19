import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Send } from 'lucide-react';
import AiMultimodels from './AiMultiModels';
import React from 'react';

const ChatInputBox = () => {
  return (
    <div className='relative min-h-screen'>
       <div className="">
         <AiMultimodels />
      </div>
      <div className='fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4'>
         <div className='w-full rounded-2xl border shadow-md max-w-2xl p-4'>
            <input type="text" placeholder='Ask me anything...' className='border-0 outline-none'/>
            <div className='mt-3 flex justify-between items-center'>
               <Button variant={'ghost'} className='' size={'icon'}>
                  <Paperclip className='size-5'/>
               </Button>
               <div className='flex gap-5'>
                  <Button variant={'ghost'} size={'icon'}><Mic/></Button>
                  <Button className='bg-[#6d3ef0]' size={'icon'}><Send /></Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default ChatInputBox;
