// api/chat.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  const { message } = req.body;

  // ✅ 환경 변수 없으면 여기서 종료
  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      reply: "⚠️ Gemini API 키가 설정되지 않았습니다.\n관리자에게 문의해주세요.",
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "⚠️ 응답을 생성하지 못했습니다.";

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(200).json({
      reply: "❌ 서버 오류가 발생했습니다.",
    });
  }
}
