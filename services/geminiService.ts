const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function sendMessageToGemini(message: string) {
  if (!API_KEY) {
    console.error("❌ Gemini API 키가 없습니다. Vercel 환경변수를 확인하세요.");
    throw new Error("Gemini API key missing");
  }

  // Google Gemini 최신 endpoint
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

    if (data.error) {
      console.error("❌ Gemini API 오류:", data.error);
      throw new Error("Gemini API 요청 실패: " + data.error.message);
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "응답 없음";
  } catch (err) {
    console.error("❌ 네트워크 오류:", err);
    throw err;
  }
}
