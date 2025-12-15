import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ text: "메시지가 없습니다." });
    }

    const API_KEY =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY; // ← fallback

    if (!API_KEY) {
      return res.status(500).json({
        text: "❌ Gemini API Key가 설정되지 않았습니다.",
      });
    }

    // 🔥 실제 Gemini API 호출
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "⚠️ Gemini 응답이 없습니다.";

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini error:", error);
    return res.status(500).json({
      text: "❌ Gemini 호출 중 오류 발생",
    });
  }
}
