// geminiService.ts

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function sendMessageToGemini(message: string, history: any[]) {
  if (!API_KEY) {
    console.error("Gemini API 키가 없습니다. Vercel 환경변수를 확인하세요.");
    throw new Error("Gemini API key missing");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: message }] }
      ]
    }),
  });

  const data = await response.json();

  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  } else {
    console.error("Gemini API 오류:", data);
    throw new Error("Gemini API 요청 실패");
  }
}
