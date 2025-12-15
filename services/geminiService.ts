type Message = {
  role: "user" | "bot";
  text: string;
};

export async function sendMessageToGemini(messages: Message[]) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();
  return data.text;
}
