import axios from "axios";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { models, chat } from "./routes/endpoint";

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

// GET
app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.get("/models", models);

// POST
app.post("/chat", chat);

export default {
  port: 3000,
  fetch: app.fetch,
};
