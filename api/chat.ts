export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        text: "⚠️ GEMINI_API_KEY가 설정되지 않았습니다.",
      });
    }

    // ✅ response는 여기서 최초 선언
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `너는 제주 여행을 도와주는 친절한 AI 챗봇이다.
아래 질문에 반드시 한국어로 자연스럽게 답변해라.

질문: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        .join("") ?? "⚠️ Gemini 응답이 비어있습니다.";

    return res.status(200).json({ text });
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(200).json({
      text: "❌ 서버 처리 중 오류가 발생했습니다.",
    });
  }
}
