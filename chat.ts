// /api/chat.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ text: "❌ message가 없습니다." });
    }

    // 🔑 API KEY
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        text: "❌ GEMINI_API_KEY가 서버에 설정되지 않았습니다.",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(message);

    // ✅ 가장 중요한 부분
    const reply =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("📤 Gemini raw result:", JSON.stringify(result, null, 2));
    console.log("📩 Gemini reply:", reply);

    return res.status(200).json({
      text: reply || "⚠️ Gemini가 빈 응답을 반환했습니다.",
    });
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);

    return res.status(500).json({
      text: "❌ 서버에서 오류가 발생했습니다.",
    });
  }
}
