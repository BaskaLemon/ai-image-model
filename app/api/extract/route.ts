import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text)
      return NextResponse.json({ error: "No text provided" }, { status: 400 });

    const model = getGeminiModel();
    const result = await model.generateContent(
      `Extract all ingredients from the following food description. Return a JSON array of objects with keys: "name", "amount" (optional), "unit" (optional). Only return valid JSON, no markdown.\n\nText: ${text}`,
    );

    const raw = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const ingredients = JSON.parse(raw);
    return NextResponse.json({ ingredients });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
