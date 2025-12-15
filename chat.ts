import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        text: "❌ 서버에 API KEY가 없습니다.",
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

    console.log("🤖 Gemini RAW:", JSON.stringify(data));

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "⚠️ Gemini 응답 없음";

    // ✅ 프론트에서 바로 쓰기 쉬운 구조
    return res.status(200).json({ text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      text: "❌ Gemini 호출 중 오류 발생",
    });
  }
}
