export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ text: "Method Not Allowed" }),
      { status: 405 }
    );
  }

  let message = "";

  try {
    const body = await req.json();
    message = body.message;
  } catch {
    return new Response(
      JSON.stringify({ text: "요청 파싱 실패" }),
      { status: 400 }
    );
  }

  if (!message) {
    return new Response(
      JSON.stringify({ text: "메시지가 없습니다." }),
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({
        text: "⚠️ GEMINI_API_KEY가 설정되지 않았습니다.",
      }),
      { status: 200 }
    );
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "system",
              parts: [
                {
                  text: "너는 제주 관광 전문 챗봇이다. 항상 한국어로 친절하고 명확하게 답변한다.",
                },
              ],
            },
            {
              role: "user",
              parts: [{ text: message }],
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

    // 🔥 여기서 이제 반드시 candidates가 생성됨
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        ?.join("") ||
      `❌ Gemini 응답 없음 (raw: ${JSON.stringify(data)})`;

    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ text: "❌ 서버 오류" }),
      { status: 200 }
    );
  }
}
