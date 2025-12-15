import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message missing" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContent(message);

    // ✅ Gemini 응답 파싱 (이게 핵심)
    const reply =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    // 🔴 여기서 reply 없으면 무조건 로그
    if (!reply) {
      console.error("❌ Gemini returned empty:", result.response);
      return res.status(200).json({
        text: "⚠️ 답변을 생성하지 못했습니다. 다시 질문해주세요.",
      });
    }

    return res.status(200).json({ text: reply });
  } catch (error) {
    console.error("🔥 Gemini API error:", error);
    return res.status(500).json({
      text: "서버 오류가 발생했습니다.",
    });
  }
}
