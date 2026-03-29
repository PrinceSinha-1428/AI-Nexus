import { createContext, useContext, Dispatch, SetStateAction } from "react";

export interface DefaultModelType {
  [key: string]: { modelId: string };
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  model?: string;
  loading?: boolean;
}

export type MessagesType = Record<string, Message[]>;

interface AIModelContextType {
  aiSelectedModel: DefaultModelType;
  setAiSelectedModel: Dispatch<SetStateAction<DefaultModelType>>;
  messages: MessagesType;
  setMessages: Dispatch<SetStateAction<MessagesType>>;
}

export const AIModelContext = createContext<AIModelContextType>({
  aiSelectedModel: {},
  setAiSelectedModel: () => {},
  messages: {},
  setMessages: () => {},
});

export const useAI = () => useContext(AIModelContext);
