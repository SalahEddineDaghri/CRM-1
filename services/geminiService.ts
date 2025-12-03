import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateInsight = async (prompt: string, context?: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment variable.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const fullPrompt = context 
      ? `Context: ${context}\n\nTask: ${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
      config: {
        systemInstruction: "You are a helpful, professional CRM assistant. Your goal is to help sales professionals close deals, manage relationships, and save time. Keep answers concise and actionable.",
      }
    });

    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate insight. Please try again later.";
  }
};

export const analyzeDeal = async (dealDetails: string): Promise<string> => {
  return generateInsight(
    "Analyze this deal. Provide: 1) Probability assessment (High/Med/Low) with reason. 2) Key risks. 3) Recommended next 3 steps to close.",
    dealDetails
  );
};

export const draftEmail = async (recipientName: string, context: string): Promise<string> => {
  return generateInsight(
    `Draft a professional, short, and persuasive email to ${recipientName}.`,
    `Email Context/Goal: ${context}`
  );
};
