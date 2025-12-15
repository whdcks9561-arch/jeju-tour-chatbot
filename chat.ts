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
      role: "system",
      parts: [
        {
          text: "너는 제주 관광 전문 AI 챗봇 '차니 봇'이다. 질문 의도에 맞게 매번 다르게 답변한다.",
        },
      ],
    },
    ...messages.map((m: any) => ({
      role: m.role,
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
      .join("") ||
    "제주 여행에 대해 어떤 걸 알고 싶으신가요?";

  res.status(200).json({ text: reply });
}
