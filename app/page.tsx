'use client';

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const page = () => {

  const { setTheme } = useTheme();

  return (
    <div>
      <Button>
        <Moon onClick={() => setTheme("dark")}/>
      </Button>
      <Button>
        <Sun onClick={() => setTheme("light")}/>
      </Button>
    </div>
  );
}

export default page;
