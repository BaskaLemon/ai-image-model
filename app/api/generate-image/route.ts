import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt)
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 },
      );

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) throw new Error("HUGGINGFACE_API_KEY not configured");

    const client = new HfInference(apiKey);

    const response = await client.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: `Professional food photography of ${prompt}, appetizing, high resolution, natural lighting`,
      parameters: { num_inference_steps: 4 },
    });

    const blob = response as unknown as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = blob.type || "image/png";

    return NextResponse.json({ image: `data:${mimeType};base64,${base64}` });
  } catch (err) {
    console.error("generate-image error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
