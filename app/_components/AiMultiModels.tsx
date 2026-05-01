import AiModels from "@/shared/AiModels";
import { ModelConfig } from "@/types";
import Image from "next/image";
import { useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader, Lock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAI } from "@/context/AIModelContext";
import { db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

const AiMultiModels = () => {
  const [aiModelList, setaiModelList] = useState<ModelConfig[]>(AiModels);
  const { user } = useUser();
  const { aiSelectedModel, setAiSelectedModel, messages } = useAI();

  const onToggleChange = (model: string, value: boolean) => {
    setaiModelList((prev) =>
      prev.map((m) => (m.model === model ? { ...m, enable: value } : m)),
    );
  };

  const onSelectValue = async (parentModel: string, value: string) => {
    const updatedModel = {
      ...aiSelectedModel,
      [parentModel]: {
        modelId: value,
      },
    };
    setAiSelectedModel(updatedModel);
    const docRef = doc(
      db,
      "users",
      user?.primaryEmailAddress?.emailAddress as string,
    );
    await updateDoc(docRef, {
      selectedModelPref: updatedModel,
    });
  };

  return (
    <div className="flex flex-1 h-[75vh] border border-b">
      {aiModelList.map((model, idx) => (
        <div
          key={idx}
          className={`flex flex-col overflow-auto h-full border-r ${model.enable ? "flex-1 min-w-[400px]" : "w-[100px] flex-none"}`}
        >
          <div className="flex w-full h-[70px] items-center justify-between border-b p-4">
            <div className="flex items-center gap-4">
              <Image
                src={model.icon}
                alt={model.model}
                width={24}
                height={24}
              />
              {model.enable && (
                <Select
                  defaultValue={aiSelectedModel[model.model]?.modelId}
                  onValueChange={(value) => onSelectValue(model.model, value)}
                  disabled={model.premium}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={aiSelectedModel[model.model]?.modelId}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="px-3">
                      <SelectLabel>Free</SelectLabel>
                      {model.subModel.map(
                        (subModel, idx) =>
                          subModel.premium === false && (
                            <SelectItem key={idx} value={subModel.id}>
                              {subModel.name}
                            </SelectItem>
                          ),
                      )}
                    </SelectGroup>
                    <SelectGroup className="px-3">
                      <SelectLabel>Premium</SelectLabel>
                      {model.subModel.map(
                        (subModel, idx) =>
                          subModel.premium === true && (
                            <SelectItem
                              key={idx}
                              value={subModel.id}
                              disabled={subModel.premium}
                            >
                              {subModel.name}{" "}
                              {subModel.premium && <Lock className="size-4" />}
                            </SelectItem>
                          ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              {model.enable ? (
                <Switch
                  onCheckedChange={(v) => onToggleChange(model.model, v)}
                  checked={model.enable}
                  className="cursor-pointer"
                />
              ) : (
                <MessageSquare
                  className="cursor-pointer"
                  onClick={() => onToggleChange(model.model, true)}
                />
              )}
            </div>
          </div>
          {model.premium && model.enable && (
            <div className="flex items-center justify-center h-full">
              <Button className="text-[#ffbb00e1]">
                <Lock color="#ffb900e3" />
                Upgrade to unlock
              </Button>
            </div>
          )}
          <div className="flex-1 p-4">
            <div className="flex-1 p-4 space-y-2">
              {Array.isArray(messages?.[model.model]) &&
                messages[model.model].map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-md ${m.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"} `}
                  >
                    {m.role === "assistant" && (
                      <span className="text-sm text-gray-300">
                        {m.model ?? model.model}
                      </span>
                    )}
                    {m.loading && (
                      <>
                        <Loader className="animate-spin" />
                        <span>Thinking...</span>
                      </>
                    )}
                    {!m.loading && m && typeof m.content !== "undefined" && (
                      <h2>{m.content}</h2>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AiMultiModels;
