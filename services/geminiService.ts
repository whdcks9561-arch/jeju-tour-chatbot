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

  // ✅ 핵심: 서버에서 내려주는 reply를 그대로 사용
  return data.reply || "⚠️ 응답이 없습니다.";
}
