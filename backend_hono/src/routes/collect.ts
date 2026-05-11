import axios from "axios";
import * as dotenv from "dotenv";

// hono
import { Context } from "hono";
import { streamText } from "hono/streaming";

// 굳이 TS로 해야할지 고민하기
import { system_prompt, assistant_prompt } from "../static/prompt";
export async function auto_report(c: Context) {
  const action = c.req.param("type");
  switch (action) {
    case "try_catch": {
      console.log(c.req.json());
      return c.json({ status: "success" });
    }
  }
}
