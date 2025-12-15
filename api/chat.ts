import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API KEY NOT FOUND" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const text = result.response.text();

    // ⭐️ 프론트에서 쓰기 쉽게 text 로 내려준다
    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      text: "⚠️ Gemini 응답 중 오류가 발생했습니다.",
    });
  }
}
