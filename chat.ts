export const config = {
  runtime: "nodejs18.x",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  let message = "";

  try {
    // ✅ 가장 안전한 방식
    const body = typeof req.body === "object"
      ? req.body
      : JSON.parse(req.body || "{}");

    message = body.message;
  } catch (e) {
    console.error("Body parse error:", e);
    return res.status(400).json({ text: "요청 파싱 실패" });
  }

  if (!message) {
    return res.status(400).json({ text: "메시지가 없습니다." });
  }

  // 🔥 여기까지 오면 500 안 남
  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      text: "⚠️ GEMINI_API_KEY가 설정되지 않았습니다. (테스트 응답)",
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "⚠️ Gemini 응답이 비어있습니다.";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Gemini Error:", err);
    return res.status(200).json({ text: "❌ 서버 오류" });
  }
}
