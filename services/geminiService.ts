const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log("API KEY:", API_KEY); // 디버깅 로그

export async function sendMessageToGemini(message: string) {
  if (!API_KEY) {
    console.error("Gemini API 키가 없습니다. Vercel 환경변수를 확인하세요.");
    throw new Error("Gemini API key missing");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateText?key=${API_KEY}`;

  const body = {
    prompt: {
      text: message
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (data.error) {
    console.error("Gemini API 오류:", data);
    throw new Error("Gemini API 요청 실패: " + data.error.message);
  }

  return data.candidates?.[0]?.outputText ?? "응답 없음";
}
