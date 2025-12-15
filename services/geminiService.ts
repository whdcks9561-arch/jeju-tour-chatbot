type Message = {
  role: "user" | "model";
  text: string;
};

export async function sendMessageToGemini(messages: Message[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await res.json();
  return data.text;
}
