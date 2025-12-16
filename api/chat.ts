export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: "안녕" }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }),
    }
  );

  const data = await res.json();

  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text)
      ?.join("") || "❌ Gemini 응답 없음";

  return new Response(JSON.stringify({ text }), { status: 200 });
}
