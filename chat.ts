import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  const { messages } = req.body;

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `
너는 제주 관광 전문 AI 챗봇 "차니 봇"이다.
한국어로 자연스럽고 질문 의도에 맞게 답변한다.
같은 문장을 반복하지 않는다.
          `.trim(),
        },
      ],
    },
    ...messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );

  const data = await response.json();

  const reply =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text)
      .join("") || "";

  return res.status(200).json({ text: reply });
}
