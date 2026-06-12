import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();
    if (!messages?.length)
      return NextResponse.json({ error: "No messages" }, { status: 400 });

    const model = getGeminiModel();

    const lastMessage = messages[messages.length - 1].content;

    const rawHistory = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    while (rawHistory.length > 0 && rawHistory[0].role === "model") {
      rawHistory.shift();
    }

    const chat = model.startChat({
      history: rawHistory,
      systemInstruction: {
        role: "user",
        parts: [
          {
            text: "You are a helpful food assistant. Help users with food-related questions, recipes, ingredient identification, nutrition, and cooking tips. Be concise and friendly.",
          },
        ],
      },
    });

    const result = await chat.sendMessage(lastMessage);
    return NextResponse.json({ reply: result.response.text() });
  } catch (err) {
    console.error("chat error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
