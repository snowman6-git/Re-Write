import axios from "axios";
import * as dotenv from "dotenv";

// hono
import { Context } from "hono";
import { streamText } from "hono/streaming";

// 굳이 TS로 해야할지 고민하기
import { MODEL_DISPLAY_CONFIG } from "../static/model";

import { chat_history_add, chat_history_load } from "./session";

dotenv.config();
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

interface ModelInfo {
  id: string;
  status?: {
    value: string;
  };
}

export async function models(c: Context) {
  let models_api = await axios.get(`${API_URL}/models`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  let models_api_data = models_api.data.data;
  const reform_model_list = models_api_data.map((model: ModelInfo) => {
  // 1. 매핑 테이블에서 해당 모델용 정보를 가져옴
  const config = MODEL_DISPLAY_CONFIG[model.id];
  // 2. 새로운 객체를 반환 (이게 포인트!)
  return {
    // ...model, // 기존에 있던 id, created 등 모든 필드를 복사 < 가는게 너무 많음
    id: model.id, // 모델명은 기존 id로 설정
    name: config?.aliases ?? model.id,
    desc: config?.desc ?? "설명 없음",
    status: model.status?.value ?? "알 수 없음", // 메모리에 올라왔는가, 안나오는 경우도 있으니 status?넣어서 후처리
    hardware: config?.hardware ?? "권장사양없음"
  };
  });
  return c.json(reform_model_list);
}

export async function chat(c: Context) {
  const { id, chat, model, custom_note, logic_plus } = await c.req.json();
  
  // 초기화 하고 리턴에서 참조가능하게 상위변수 지정
  let thinking_tokens = 0
  if (logic_plus == false) {
    thinking_tokens = 0;
  } else {
    thinking_tokens = 560;
  }
  // 유저입력을 추가
  await chat_history_add(id, "user", chat);
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
    // 채팅기록을 불러옴, 이때 방금 막 추가한 메세지도 불러와 사용됌
    messages: await chat_history_load()

      // { role: "user", content: `${chat}` },
      // { role: "user", content: `${chat} 유저의 입력입니다, 이는 유저의 행동, 혹은 C의 행동을 묘사하는 내용입니다.` },
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
			for (const line of chunk.split('\n')) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        const jsonStr = line.slice(6); //6개로 썰어야 시작종료 태그가 된다고 함
        const data = JSON.parse(jsonStr);
        const content = data.choices[0]?.delta?.content || '';
        await stream.write(content);
      } else if (line.trim() === 'data: [DONE]') {
      }
      }
    }
  });
}

  // requestBody.messages.push()


//   const response = await fetch(`${API_URL}/v1/chat/completions`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(requestBody),
//   });
//   // 이건진짜 나중에 리팩토링 & 완벽하게 이해하기 필요할듯
//   return streamText(c, async (stream) => {
//     const reader = response.body?.getReader();
//     if (!reader) return;

//     const decoder = new TextDecoder();
//     let fullReply = ""; // 완성본을 저장할 변수

//     while (true) {
//       const { done, value } = await reader.read();
//       // 1. 네트워크 연결 자체가 끊겼을 때 (안전장치)
//       // if (done) {
//       //   await chat_history_add(id, "assistant", fullReply);
//       //   break;
//       // }

//       const chunk = decoder.decode(value);
      
//       // 프론트엔드로 실시간 토스
//       await stream.write(chunk);

//       // 2. 텍스트 파싱해서 완성본 모으기
//       const lines = chunk.split('\n');
//       for (const line of lines) {
//         // llama-server가 명시적으로 끝을 알리는 신호
//         if (line.trim() === 'data: [DONE]') {
//           await stream.write("data: [DONE]")
//           await chat_history_add(id, "assistant", fullReply);
//           break; 
//         }

//         if (line.startsWith('data: ')) {
//           try {
//             const jsonStr = line.slice(6);
//             const data = JSON.parse(jsonStr);
//             const content = data.choices[0]?.delta?.content || "";
            
//             // 한 글자씩 데이터 누적
//             fullReply += content; 
//           } catch (e) {
//             // 빈 줄이거나 파싱 불가능한 데이터는 무시
//             continue;
//           }
//         }
//       }
//     }
//   });
// }