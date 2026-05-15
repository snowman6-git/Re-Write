import axios from "axios";
import * as dotenv from "dotenv";

// hono
import { Context } from "hono";
import { streamText } from "hono/streaming";

// 굳이 TS로 해야할지 고민하기
import { system_prompt, assistant_prompt } from "../static/prompt";
import { MODEL_DISPLAY_CONFIG } from "../static/model";

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
  let models_api_data = models_api.data.data;
  const reform_model_list = models_api_data.map(model => {
  // 1. 매핑 테이블에서 해당 모델용 정보를 가져옴
  const config = MODEL_DISPLAY_CONFIG[model.id];
  // 2. 새로운 객체를 반환 (이게 포인트!)
  return {
    // ...model, // 기존에 있던 id, created 등 모든 필드를 복사 < 가는게 너무 많음
    id: model.id, // 모델명은 기존 id로 설정
    name: config?.aliases ?? model.id,
    desc: config?.desc ?? "설명 없음",
    status: model.status.value, // 메모리에 올라왔는가, 없는경우도 있으니 ?? <
    hardware: config?.hardware ?? "권장사양없음"
  };
  });
  return c.json(reform_model_list);
}

export async function chat(c: Context) {
  const { chat, model, custom_note, logic_plus } = await c.req.json();
  
  // 초기화 하고 리턴에서 참조가능하게 상위변수 지정
  let thinking_tokens = 0
  if (logic_plus == false) {
    thinking_tokens = 0;
  } else {
    thinking_tokens = 560;
  }
  
  const requestBody = {
    model: model,
    // Advance parameters
    min_p: 0.5,
    temperature: 1.2,
    // token
    max_tokens: 2000,
    thinking_budget_tokens: thinking_tokens,
    // streaming
    stream: true, // 반드시 true로 설정
    is_input: true,
    // enable_thinking: true, 제대로 되는건지 모르겠음.
    messages: [
      { role: "system", content: `${system_prompt}\n${custom_note}` },
      { role: "assistant", content: `${assistant_prompt}` },
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