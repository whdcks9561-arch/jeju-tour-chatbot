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
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages missing" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 🔹 대화 → 하나의 프롬프트로 합침
    const prompt = messages
      .map((m: any) =>
        m.role === "user" ? `사용자: ${m.text}` : `봇: ${m.text}`
      )
      .join("\n");

    const result = await model.generateContent(prompt);

    // ✅ 여기 핵심
    const reply =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("Gemini empty response", result.response);
      return res.status(200).json({ text: "" });
    }

    return res.status(200).json({ text: reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Gemini failed" });
  }
}
