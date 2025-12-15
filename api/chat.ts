import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const { message } = req.body;

  // ✅ 환경변수 없으면 Gemini 호출 자체를 안 함
  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      text: "⚠️ GEMINI_API_KEY가 설정되지 않았습니다.\n(지금은 테스트 응답입니다)",
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
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
      "⚠️ Gemini 응답이 비어있습니다.";

    // ✅ 무조건 text만 내려줌
    return res.status(200).json({ text });
  } catch (err) {
    console.error("❌ Gemini Error:", err);
    return res.status(200).json({
      text: "❌ 서버 오류가 발생했습니다.",
    });
  }
}
