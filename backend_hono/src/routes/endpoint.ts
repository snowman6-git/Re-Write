import axios from "axios";
import * as dotenv from "dotenv";

// hono
import { Context } from "hono";
import { streamText } from "hono/streaming";

// 굳이 TS로 해야할지 고민하기
import { system_prompt, assistant_prompt } from "../static/prompt";

dotenv.config();

const API_URL = process.env.OPEN_WEBUI_URL;
const API_KEY = process.env.API_KEY;

export async function models(c: Context) {
  let models_api = await axios.get(`${API_URL}/models`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return c.json(models_api.data.data);
}

export async function chat(c: Context) {
  const { chat, model, custom_note } = await c.req.json();
  const requestBody = {
    model: model,
    max_tokens: 1200,
    min_p: 0.5,
    temperature: 1.2,
    stream: true, // 반드시 true로 설정
    messages: [
      { role: "system", content: `${system_prompt}\n${custom_note}` },
      { role: "assistant", content: assistant_prompt },
      { role: "user", content: `${chat} 유저의 입력입니다, 이는 유저의 행동, 혹은 C의 행동을 묘사하는 내용입니다.` },
    ],
  };

  //여기부터 제미나이가 짜줌 + fetch여야하나?
  const response = await fetch(`${API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  // Hono의 streamText 기능을 사용하여 프론트로 스트림 전달
  return streamText(c, async (stream) => {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      // 여기서 chunk를 가공(SSE 포맷 파싱 등)할 수도 있지만,
      // 간단하게 그대로 넘기는 예시입니다.
      await stream.write(chunk);
    }
  });
}
