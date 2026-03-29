import { Progress } from '@/components/ui/progress';
import React from 'react';

const UsageCreditProgress = () => {
  return (
    <div className='flex p-3 border rounded-3xl flex-col mb-5 gap-2'>
      <strong className='text-xl'>Free Plan</strong>
      <p className='text-gray-400'>0/5 message used</p>
      <Progress value={35} />
    </div>
  );
}

export default UsageCreditProgress;
