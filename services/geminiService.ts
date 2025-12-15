export async function sendMessageToGemini(message: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();

  console.log("📦 API response:", data);

  // ✅ 이제 이것만 보면 됨
  return data.text ?? "⚠️ 응답이 없습니다.";
}
