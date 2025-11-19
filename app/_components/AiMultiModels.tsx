import AiModels from "@/shared/AiModels";
import { ModelConfig } from "@/types";
import Image from "next/image";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch";
import { Lock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const AiMultiModels = () => {

  const [aiModelList, setaiModelList] = useState<ModelConfig[]>(AiModels);

  const onToggleChange = (model: string, value: boolean) => {
        setaiModelList((prev) => prev.map((m) => m.model === model ? {...m, enable: value }: m))
  }

  return (
    <div className="flex flex-1 h-[75vh] border border-b">
     {aiModelList.map((model, idx) => (
      <div key={idx} className={`flex flex-col overflow-auto h-full border-r ${model.enable ? 'flex-1 min-w-[400px]' : 'w-[100px] flex-none' }`}>
      <div  className="flex w-full h-[70px] items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <Image src={model.icon} alt={model.model} width={24} height={24} />
         {model.enable && <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={model.subModel[0].name} />
            </SelectTrigger>
            <SelectContent >
              {model.subModel.map((subModel,idx) => (
                <SelectItem key={idx} value={subModel.name}>{subModel.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>}
        </div>
         <div>
            {model.enable ?  <Switch onCheckedChange={(v) => onToggleChange(model.model, v)} checked={model.enable} className="cursor-pointer" /> : <MessageSquare className="cursor-pointer" onClick={() => onToggleChange(model.model,true)}/>
              }        
        </div>
      </div>
      { model.premium && model.enable && <div className="flex items-center justify-center h-full">
        <Button className="text-[#ffbb00e1]">
          <Lock color="#ffb900e3"/>
          Upgrade to unlock
        </Button>
      </div>}
    </div>
     ))}
    </div>
  );
}

export default AiMultiModels;
