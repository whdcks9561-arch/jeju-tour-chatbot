import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs18.x",
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  let message = "";

  try {
    if (typeof req.body === "string") {
      const parsed = JSON.parse(req.body);
      message = parsed.message;
    } else {
      message = req.body?.message;
    }
  } catch {
    return res.status(400).json({ text: "잘못된 요청 형식입니다." });
  }

  if (!message) {
    return res.status(400).json({ text: "메시지가 없습니다." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      text: "⚠️ GEMINI_API_KEY가 설정되지 않았습니다.\n(테스트 응답)",
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
            { role: "user", parts: [{ text: message }] },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Gemini API Error:", data);
      return res.status(200).json({
        text: "❌ Gemini API 호출 실패",
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "⚠️ Gemini 응답이 비어있습니다.";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("❌ Gemini Error:", err);
    return res.status(200).json({
      text: "❌ 서버 오류가 발생했습니다.",
    });
  }
}
