// src/services/geminiService.ts
export async function sendMessageToGemini(message: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  // ✅ 항상 문자열 보장
  return typeof data.reply === "string"
    ? data.reply
    : "⚠️ 응답 형식 오류";
}
