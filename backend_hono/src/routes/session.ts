import { Database } from "bun:sqlite";
import { Context } from "hono";
import { chat } from "./endpoint";
import { system_prompt, assistant_prompt } from "../static/prompt";
import * as dotenv from "dotenv";

// const db = new Database(":memory:");
// let a = db.query(` 
//     CREATE TABLE IF NOT EXISTS chat_history (
//         id TEXT NOT NULL,
//         sender TEXT NOT NULL,
//         content TEXT NOT NULL,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     );
// `).run();

let chat_history: Array<object> = [
    { role: "system", content: `${system_prompt}` },
    { role: "assistant", content: `${assistant_prompt}` },
]
// 세션 관련 라우트들, 세션은 일단 간단하게 DB에 저장하는 형태로 구현, 나중에 Redis나 다른 스토리지로 변경 가능
export async function chat_history_add(id: string, sender: string, content: string) {
    chat_history.push({ "role": sender, "content": content });
    // db.query(`INSERT INTO chat_history (id, sender, content) VALUES (?, ?, ?)`).run(id, sender, content);
}

export async function chat_history_load() {
    // const load_chat = db.query(`SELECT * FROM chat_history ORDER BY created_at DESC`).all();
    //   { role: "user", content: `${chat}` },
    return chat_history;
}
