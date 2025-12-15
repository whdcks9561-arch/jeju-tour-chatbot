// api/chat.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  const { messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  // ✅ React messages → Gemini contents 변환
  const contents = messages.map((m: any) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `너는 제주 관광 전문 AI 챗봇 "차니 봇"이다.
반드시 한국어로, 친절하고 구체적으로 답변한다.`,
              },
            ],
          },
          ...contents,
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 512,
        },
      }),
    });

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") ??
      "죄송해요, 다시 한 번 말씀해 주세요 🙂";

    res.status(200).json({ text: reply });
  } catch (err) {
    res.status(500).json({ error: "Gemini API error", detail: String(err) });
  }
}
