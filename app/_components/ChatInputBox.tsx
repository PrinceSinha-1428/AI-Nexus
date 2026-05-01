import { Button } from "@/components/ui/button";
import { Mic, Paperclip, Send } from "lucide-react";
import AiMultimodels from "./AiMultiModels";
import React, { useEffect, useRef, useState } from "react";
import { useAI } from "@/context/AIModelContext";
import axios from "axios";
import { v4 as uuidV4 } from "uuid";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

const ChatInputBox = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [chatId, setChatId] = useState<string>("");
  const { user } = useUser();
  const { messages, setMessages, aiSelectedModel } = useAI();
  const params = useSearchParams();
  const id = params.get("chat") as string;
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (id) {
      isFetchingRef.current = true;
      setMessages({});
      setChatId(id);
      getMessages(id);
    } else {
      isFetchingRef.current = false;
      setMessages({});
      setChatId(uuidV4());
    }
  }, [id]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(aiSelectedModel).forEach((modelKey) => {
        updated[modelKey] = [
          ...(updated[modelKey] ?? []),
          { role: "user", content: userInput },
        ];
      });
      return updated;
    });

    const currentInput = userInput;
    setUserInput("");

    Object.entries(aiSelectedModel).forEach(
      async ([parentModel, modelInfo]) => {
        if (!modelInfo.modelId) return;

        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []),
            {
              role: "assistant",
              content: "Thinking...",
              model: parentModel,
              loading: true,
            },
          ],
        }));

        try {
          const result = await axios.post("/api/ai-multi-model", {
            model: modelInfo.modelId,
            msg: [{ role: "user", content: currentInput }],
            parentModel,
          });

          const { aiResponse, model } = result.data;

          setMessages((prev) => {
            const updated = [...(prev[parentModel] ?? [])];
            const loadingIndex = updated.findIndex((m) => m.loading);

            if (loadingIndex !== -1) {
              updated[loadingIndex] = {
                role: "assistant",
                content: aiResponse,
                model,
                loading: false,
              };
            } else {
              updated.push({
                role: "assistant",
                content: aiResponse,
                model,
                loading: false,
              });
            }

            return { ...prev, [parentModel]: updated };
          });
        } catch (err) {
          console.error(err);
          setMessages((prev) => ({
            ...prev,
            [parentModel]: [
              ...(prev[parentModel] ?? []),
              { role: "assistant", content: "Error fetching response." },
            ],
          }));
        }
      },
    );
  };

  useEffect(() => {
    if (!isFetchingRef.current && chatId && Object.keys(messages).length > 0) {
      saveMessages();
    }
  }, [messages, chatId]);

  const saveMessages = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!chatId || !userEmail) return;
    try {
      const docRef = doc(db, "chatHistory", chatId);
      await setDoc(docRef, {
        chatId: chatId,
        userEmail,
        messages: messages,
        lastUpdated: Date.now(),
      });
    } catch (err) {
      console.error("Failed to save messages", err);
    }
  };

  const getMessages = async (id: string) => {
    if (!id) return;
    try {
      const docRef = doc(db, "chatHistory", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setMessages({});
        return;
      }
      const docData = docSnap.data();
      if (docData?.messages && typeof docData.messages === "object") {
        setMessages(docData.messages);
      } else {
        setMessages({});
      }
    } finally {
      isFetchingRef.current = false;
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="">
        <AiMultimodels key={chatId} />
      </div>
      <div className="fixed bottom-0 left-0 w-full flex justify-center px-4 pb-4">
        <div className="w-full rounded-2xl border shadow-md max-w-2xl p-4">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="border-0 outline-none w-full"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <div className="mt-3 flex justify-between items-center">
            <Button variant={"ghost"} className="" size={"icon"}>
              <Paperclip className="size-5" />
            </Button>
            <div className="flex gap-5">
              <Button variant={"ghost"} size={"icon"}>
                <Mic />
              </Button>
              <Button
                className="bg-[#6d3ef0] dark:text-white"
                size={"icon"}
                onClick={handleSend}
              >
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;
