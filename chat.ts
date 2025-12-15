import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ text: "메시지가 없습니다." });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ text: "API KEY 없음" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const result = await response.json();

    const text =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "⚠️ Gemini 응답 없음";

    // 🔥 핵심: 프론트에 단순 구조로 내려줌
    return res.status(200).json({ text });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ text: "서버 오류 발생" });
  }
}
