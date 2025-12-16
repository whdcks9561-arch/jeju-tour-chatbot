export const config = {
  runtime: "nodejs18.x",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ text: "Method Not Allowed" }));
    return;
  }

  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }

  const { message } = JSON.parse(body || "{}");

  if (!message) {
    res.statusCode = 400;
    res.end(JSON.stringify({ text: "메시지가 없습니다." }));
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        text: "⚠️ GEMINI_API_KEY가 설정되지 않았습니다.",
      })
    );
    return;
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

    res.statusCode = 200;
    res.end(JSON.stringify({ text }));
  } catch (err) {
    console.error(err);
    res.statusCode = 200;
    res.end(JSON.stringify({ text: "❌ 서버 오류" }));
  }
}
