export async function sendMessageToGemini(message: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  console.log("📩 Server response:", data);

  return data.text ?? "";
}
