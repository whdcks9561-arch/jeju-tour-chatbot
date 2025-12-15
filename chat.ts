export default async function handler(req, res) {
  const { message } = req.body;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    }
  );

  const data = await geminiRes.json();

  // ⭐⭐⭐ 핵심: text만 뽑아서 내려준다
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "⚠️ 응답이 없습니다.";

  return res.status(200).json({ text });
}
