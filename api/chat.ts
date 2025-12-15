// api/chat.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ VITE_GEMINI_API_KEY 사용 (환경 변수 수정 필요 없음)
  const API_KEY = process.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "Gemini API Key가 없습니다.",
      hint: "VITE_GEMINI_API_KEY 환경 변수를 확인하세요.",
    });
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
반드시 한국어로 친절하고 구체적으로 답변해라.

사용자 질문:
${message}
            `.trim(),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 800,
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
        .join("\n");

    if (!reply) {
      return res.status(200).json({
        text: "⚠️ Gemini 응답은 왔지만 내용이 비어있습니다.",
        raw: data,
      });
    }

    return res.status(200).json({ text: reply });
  } catch (err) {
    return res.status(500).json({
      error: "Gemini API 호출 실패",
      detail: String(err),
    });
  }
}
