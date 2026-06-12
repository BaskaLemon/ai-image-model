import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiModel(model = "gemini-flash-latest") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model,
    systemInstruction:
      "You are a helpful food assistant. Help users with food-related questions, recipes, ingredient identification, nutrition, and cooking tips. Be concise and friendly.",
  });
}
