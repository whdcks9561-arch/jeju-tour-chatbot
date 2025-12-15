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

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  const url =
    `https://generativelanguage.googleapis.com/v1/models/` +
    `gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
너는 제주 관광 전문 AI 챗봇 "차니 봇"이다.
반드시 한국어로 친절하게 답변한다.

사용자 질문:
${message}
            `.trim(),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") ||
      "안녕하세요! 😊 제주 여행에 대해 무엇이든 물어보세요.";

    return res.status(200).json({ text: reply });
  } catch (e) {
    return res.status(500).json({ error: "Gemini API 오류" });
  }
}
