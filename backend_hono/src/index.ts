import axios from "axios";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { models, chat } from "./routes/endpoint";

// 프론트 에러를 동의 없이 수집해도 되는지 알아보기
import { auto_report } from "./routes/collect";
import { serveStatic } from "hono/bun";


const app = new Hono();
app.use(
  // '*',
  cors({
    origin: "http://localhost:5173",
    // allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ["POST", "GET", "OPTIONS"],
    // exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    // maxAge: 600,
    credentials: true,
  }),
);
app.use('/*', serveStatic({ root: './public' }))

// GET
app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.get("/models", models);

// POST
app.post("/chat", chat);

app.post("/auto_report/:type", auto_report);

export default {
  port: 3000,
  fetch: app.fetch,
};
