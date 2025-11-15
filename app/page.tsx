'use client';

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const page = () => {

  const { setTheme } = useTheme();

  return (
    <div>
      <Button onClick={() => setTheme("dark")}>
        <Moon />
      </Button>
      <Button onClick={() => setTheme("light")}>
        <Sun />
      </Button>
    </div>
  );
}

export default page;
