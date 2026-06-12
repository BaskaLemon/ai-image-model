import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    if (!file)
      return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const model = getGeminiModel();
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type as "image/jpeg" | "image/png",
          data: base64,
        },
      },
      "Analyze this food image. Describe what dish it is, list all visible ingredients, and provide a brief nutritional overview. Be concise and structured.",
    ]);

    const text = result.response.text();
    return NextResponse.json({ caption: text });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
