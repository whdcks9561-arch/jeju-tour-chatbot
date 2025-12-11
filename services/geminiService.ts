import { GoogleGenAI, Content } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ChatMessage } from "../types";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in process.env.API_KEY");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const sendMessageToGemini = async (
  currentMessage: string,
  history: ChatMessage[]
): Promise<string> => {
  try {
    const ai = getClient();

    // Convert app history to Gemini Content format
    const formattedHistory: Content[] = history.map((msg) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

    const model = 'gemini-2.5-flash';
    
    // We are using a stateless approach for simplicity here, sending history manually.
    // However, ai.chats.create keeps state. Let's use ai.models.generateContent 
    // for a pure request/response pattern including history + system instruction context.
    
    // Construct the full conversation context
    // System instruction is passed via config
    const contents: Content[] = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: currentMessage }],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Increased to allow general knowledge flexibility
      },
    });

    if (response.text) {
      return response.text;
    }
    
    return "죄송합니다. 답변을 생성하는데 문제가 발생했습니다.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};