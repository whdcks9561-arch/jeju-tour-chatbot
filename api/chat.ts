import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method not allowed" });
  }

  const API_KEY = process.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      text: "❌ Gemini API KEY가 서버에 없습니다.",
    });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ text: "메시지가 없습니다." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // ✅ 핵심: Gemini 응답 안전 파싱
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "안녕하세요 😊 제주 여행에 대해 도와드릴게요!";

    return res.status(200).json({ text: reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      text: "❌ Gemini API 호출 중 오류가 발생했습니다.",
    });
  }
}
