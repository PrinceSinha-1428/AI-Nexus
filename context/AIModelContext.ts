import { createContext, useContext, Dispatch, SetStateAction } from "react";

export interface DefaultModelType {
   [key: string]: { modelId: string };
}

interface AIModelContextType {
   aiSelectedModel: DefaultModelType;
   setAiSelectedModel: Dispatch<SetStateAction<DefaultModelType>>;
}

export const AIModelContext = createContext<AIModelContextType>({
   aiSelectedModel: {},
   setAiSelectedModel: () => {}
});

export const useAI = () => useContext(AIModelContext)