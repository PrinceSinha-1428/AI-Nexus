'use client';


import { useTheme } from "next-themes";
import ChatInputBox from "./_components/ChatInputBox";

const page = () => {

  const { setTheme } = useTheme();

  return (
    <div>
      <ChatInputBox/>
    </div>
  );
}

export default page;
