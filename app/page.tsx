/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  RefreshCw,
  Sparkles,
  Image,
  MessageCircle,
  X,
  Send,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [summary, setSummary] = useState(
    "First, enter your image to recognize ingredients.",
  );
  const [ingredientText, setIngredientText] = useState("");
  const [ingredients, setIngredients] = useState(
    "First, enter your text to recognize ingredients.",
  );
  const [imagePrompt, setImagePrompt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:
            "You are a helpful AI assistant for a food analysis app. Help users with food-related questions, ingredient identification, and image analysis tips. Be concise and friendly.",
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply =
        data.content?.[0]?.text ?? "Sorry, I couldn't get a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }
  };

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="h-16 w-screen border-b flex items-center font-bold mb-6 px-6">
        AI tools
      </div>

      <div className="w-full max-w-2xl px-4">
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="analysis">Image analysis</TabsTrigger>
            <TabsTrigger value="ingredients">
              Ingredient recognition
            </TabsTrigger>
            <TabsTrigger value="creator">Image creator</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h2 className="text-lg font-medium">Image analysis</h2>
              <button
                onClick={() => {
                  setFileName(null);
                  setSummary(
                    "First, enter your image to recognize ingredients.",
                  );
                }}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Upload a food photo, and AI will detect the ingredients.
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-violet-400 rounded-md p-8 text-center cursor-pointer bg-violet-50 hover:bg-violet-100 mb-3"
            >
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.png"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
              <span className="text-sm text-violet-600">
                {fileName ?? "Choose File — JPG, PNG"}
              </span>
            </div>
            <div className="flex justify-end mb-6">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700">
                Generate
              </button>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4" />
              <h3 className="font-medium">Here is the summary</h3>
            </div>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </TabsContent>
          <TabsContent value="ingredients">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h2 className="text-lg font-medium">Ingredient recognition</h2>
              <button
                onClick={() => {
                  setIngredientText("");
                  setIngredients(
                    "First, enter your text to recognize ingredients.",
                  );
                }}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Describe the food, and AI will detect the ingredients.
            </p>
            <textarea
              value={ingredientText}
              onChange={(e) => setIngredientText(e.target.value)}
              placeholder="Орц тодорхойлох"
              className="w-full border rounded-md p-3 text-sm resize-none h-32 focus:outline-none focus:ring-1 focus:ring-violet-400 mb-3"
            />
            <div className="flex justify-end mb-6">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700">
                Generate
              </button>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4" />
              <h3 className="font-medium">Identified Ingredients</h3>
            </div>
            <p className="text-sm text-muted-foreground">{ingredients}</p>
          </TabsContent>
          <TabsContent value="creator">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-violet-500" />
              <h2 className="text-lg font-medium">Image creator</h2>
              <button
                onClick={() => setImagePrompt("")}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Describe a dish and generate a food image.
            </p>
            <textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Describe the food image you want to create..."
              className="w-full border rounded-md p-3 text-sm resize-none h-32 focus:outline-none focus:ring-1 focus:ring-violet-400 mb-3"
            />
            <div className="flex justify-end mb-6">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700">
                Generate
              </button>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4" />
              <h3 className="font-medium">Generated image</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              First, enter your prompt to generate an image.
            </p>
          </TabsContent>
        </Tabs>
      </div>
      <button
        onClick={() => setChatOpen((o) => !o)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-lg hover:bg-gray-700 z-50"
      >
        {chatOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
      </button>

      {chatOpen && (
        <div
          className="fixed bottom-20 right-6 w-80 bg-white border rounded-xl shadow-xl flex flex-col z-50 overflow-hidden"
          style={{ height: "420px" }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-50">
            <MessageCircle className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium">Chat assistant</span>
            <button
              onClick={() => setChatOpen(false)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] text-sm px-3 py-2 rounded-xl ${
                    m.role === "user"
                      ? "bg-gray-800 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-400 text-sm px-3 py-2 rounded-xl rounded-bl-sm">
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="flex items-center gap-2 px-3 py-3 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
