
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  const url =
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
    API_KEY;

  const body = {
  contents: [
    {
      role: "user",
      parts: [
        {
          text: `
당신은 제주 여행을 도와주는 친절한 AI 챗봇입니다.
한국어로 자연스럽게 대화하듯 답변해주세요.

사용자 질문:
${message}
          `.trim(),
        },
      ],
    },
  ],
};


  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log("🧪 RAW Gemini response:", JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") ?? "";

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({
      error: "Gemini API 호출 실패",
      detail: String(error),
    });
  }
}

