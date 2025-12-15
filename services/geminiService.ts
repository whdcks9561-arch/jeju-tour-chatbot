export async function sendMessageToGemini(
  messages: { role: string; text: string }[]
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();
  return data.text;
}
