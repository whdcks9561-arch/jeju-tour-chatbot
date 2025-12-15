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
    return res.status(400).json({ error: "Invalid messages" });
  }

  // ✅ Gemini는 system role 미지원 → 첫 user 메시지에 지침 포함
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `
너는 제주 관광 전문 AI 챗봇 "차니 봇"이다.
한국어로 자연스럽게 답변하고,
사용자 질문 의도에 맞게 매번 다르게 응답한다.
같은 문장을 반복하지 않는다.

이제부터의 대화를 참고해 답변하라.
          `.trim(),
        },
      ],
    },

    // ✅ 대화 히스토리
    ...messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
  ];

  try {
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
      "제주 여행에 대해 어떤 걸 도와드릴까요? 😊";

    return res.status(200).json({ text: reply });
  } catch (err) {
    return res.status(500).json({ error: "Gemini API error" });
  }
}
