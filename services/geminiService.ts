export async function sendMessageToGemini(message: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("API 요청 실패");
  }

  const data = await response.json();

  console.log("📦 API raw response:", data);

  return (
  data.text ??
  data.candidates?.[0]?.content?.parts?.[0]?.text ??
  "⚠️ 응답이 없습니다."
);
