import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ text: "메시지가 없습니다." });
  }

  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      // ✅ 환경변수 없을 때도 동작하게 (요청하신 조건)
      return res.status(200).json({
        text: "⚠️ 현재 AI 연결이 꺼져 있습니다. (API KEY 없음)",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "⚠️ AI 응답이 비어 있습니다.";

    // ⭐⭐⭐ 핵심: 무조건 text 하나만 내려줌
    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ text: "서버 오류 발생" });
  }
}
