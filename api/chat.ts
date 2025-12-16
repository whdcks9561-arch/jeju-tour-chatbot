import "isomorphic-fetch";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      text: "⚠️ GEMINI_API_KEY가 설정되지 않았습니다.",
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({
        text: `❌ Gemini 오류: ${data.error.message}`,
      });
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") ?? "⚠️ Gemini 응답이 비어있습니다.";

    return res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ text: "❌ 서버 오류" });
  }
}
