import axios from 'axios'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { system_prompt, assistant_prompt } from './static/prompt'
import * as dotenv from 'dotenv';
dotenv.config();

// interface Message {
//   role: 'user' | 'assistant' | 'system';
//   content: string;
// }
// interface ChatRequest {
//   model: string;
//   messages: Message[];
//   stream: boolean; // 스트림 여부를 결정하는 핵심 필드
// }

const app = new Hono()

app.use(
  // '*',
  cors({
    origin: 'http://localhost:5173',
    // allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    // exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    // maxAge: 600,
    credentials: true,
  })
)

const API_URL = process.env.OPEN_WEBUI_URL
const API_KEY = process.env.API_KEY

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/models', async(c) => {
  let models_api = await axios.get(`${API_URL}/models`, {
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
  })
  return c.json(models_api.data.data)
})
    
import { streamText } from 'hono/streaming'

app.post('/chat', async (c) => {
  const { chat, model } = await c.req.json();
  const requestBody = {
    model: model,
    max_tokens: 1200,
    min_p: 0.5,
    temperature: 1.2,
    stream: true, // 반드시 true로 설정
    messages: [
      { role: 'system', content: system_prompt },
      { role: 'assistant', content: assistant_prompt },
      { role: 'user', content: chat }
    ],
  };

  const response = await fetch(`${API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
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
});


export default { 
  port: 3000, 
  fetch: app.fetch, 
}
