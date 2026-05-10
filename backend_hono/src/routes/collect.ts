import axios from "axios";
import * as dotenv from "dotenv";

// hono
import { Context } from "hono";
import { streamText } from "hono/streaming";

// 굳이 TS로 해야할지 고민하기
import { system_prompt, assistant_prompt } from "../static/prompt";

export async function auto_report(c: Context) {

  const action = c.req.param('type');
  switch (action) {
    case "try_catch": {
      console.log(c.req.json());
    }
  }
}

export async function chat(c: Context) {
  const { chat, model } = await c.req.json();
  const requestBody = {
    model: model,
    max_tokens: 1200,
    min_p: 0.5,
    temperature: 1.2,
    stream: true, // 반드시 true로 설정
    messages: [
      { role: "system", content: system_prompt },
      { role: "assistant", content: assistant_prompt },
      { role: "user", content: chat },
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
