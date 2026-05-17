import axios from "axios";
import * as dotenv from "dotenv";

// hono
import { Context } from "hono";

export async function auto_report(c: Context) {
  const action = c.req.param("type");
  switch (action) {
    case "try_catch": {
      console.log(c.req.json());
      return c.json({ status: "success" });
    }
  }
}
