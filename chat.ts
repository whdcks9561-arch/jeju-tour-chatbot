import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }

  const { message } = req.body;

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: message }],
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

    return res.status(200).json({
      text: data.candidates?.[0]?.content?.parts?.[0]?.text ?? "",
    });
  } catch (err) {
    return res.status(500).json({ error: "Gemini 서버 호출 실패", detail: err });
  }
}
