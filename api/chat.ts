export const config = { runtime: "edge" };

export default async function handler() {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: "Say hello in Korean" }],
          },
        ],
      }),
    }
  );

  const raw = await res.text();
  return new Response(raw, { status: 200 });
}
