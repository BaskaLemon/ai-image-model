import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages?.length)
      return NextResponse.json({ error: "No messages" }, { status: 400 });

    const model = getGeminiModel();
    const chat = model.startChat({
      history: messages
        .slice(0, -1)
        .map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      systemInstruction:
        "You are a helpful food assistant. Help users with food-related questions, recipes, ingredient identification, nutrition, and cooking tips. Be concise and friendly.",
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    return NextResponse.json({ reply: result.response.text() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
