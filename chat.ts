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
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    // ✅ 가장 안전한 텍스트 추출
    const reply = result.response.text();

    console.log("✅ Gemini reply:", reply);

    if (!reply) {
      return res.status(200).json({
        text: "⚠️ 답변을 생성하지 못했습니다. 다시 시도해주세요.",
      });
    }

    return res.status(200).json({ text: reply });
  } catch (error) {
    console.error("🔥 Gemini error:", error);
    return res.status(500).json({
      text: "서버 오류가 발생했습니다.",
    });
  }
}
