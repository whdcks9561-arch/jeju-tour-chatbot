// services/geminiService.ts
export async function sendMessageToGemini(message: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  console.log("📦 API response:", data);

  return data?.text ?? "⚠️ 응답이 없습니다.";
}
