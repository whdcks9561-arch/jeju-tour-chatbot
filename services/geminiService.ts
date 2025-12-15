// services/geminiService.ts
export async function sendMessageToGemini(
  messages: { role: "user" | "bot"; text: string }[]
) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  const data = await res.json();
  return data.text;
}
