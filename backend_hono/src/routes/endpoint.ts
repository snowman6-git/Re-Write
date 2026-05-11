import axios from "axios";
import * as dotenv from "dotenv";

// hono
import { Context } from "hono";
import { streamText } from "hono/streaming";

// 굳이 TS로 해야할지 고민하기
import { system_prompt, assistant_prompt } from "../static/prompt";

dotenv.config();

const API_URL = process.env.API_URL;
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
  const response = await fetch(`${API_URL}/v1/chat/completions`, { // 엔드포인트 확인
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
    body: JSON.stringify(requestBody),
  });
  return streamText(c, async (stream) => {
    const reader = response.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      // llama-server에서 오는 SSE 데이터를 그대로 프론트로 전달
      await stream.write(chunk);
    }
  });
}