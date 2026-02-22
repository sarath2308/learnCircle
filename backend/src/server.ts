import express from "express";
import { json, urlencoded } from "express";
import dotenv from "dotenv";
import { connectRedis } from "./config/redis/redis";
import expressWinston from "express-winston";
import logger from "./logs.config/logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware";
import { entryRoute } from "./routes/entry.route";
import http from "http";
import { initSocket } from "./socket";
import { loadConfigFromSSM } from "./config/ssm/ssm";
import { connectDB } from "./config/db/mongo/mongo";
dotenv.config();
const app = express();

// Middleware - Json
app.use((req, res, next) => {
  const contentType = req.headers["content-type"];

  if (contentType?.startsWith("multipart/form-data")) {
    return next();
  }

  json()(req, res, next);
});

app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} | status: {{res.statusCode}} | responseTime: {{res.responseTime}}ms",
    requestWhitelist: ["body", "params", "query"], // remove headers
    responseWhitelist: ["body"],
    dynamicMeta: (req) => {
      // remove sensitive data
      const safeBody = { ...req.body };
      if (safeBody.password) delete safeBody.password;
      return { req: { body: safeBody } };
    },
    colorize: true,
  }),
);

async function startServer() {
  const env = process.env.NODE_ENV === "production" ? "prod" : "dev";

  await loadConfigFromSSM(env);
  console.log(process.env.DB_URI);
  await connectDB();
  await connectRedis();

  const server = http.createServer(app);

  initSocket(server);

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
  );

  app.use("/api", entryRoute());

  app.use(
    expressWinston.errorLogger({
      winstonInstance: logger,
      msg: "ERROR {{req.method}} {{req.url}} => {{err.message}}",
    }),
  );

  app.use(errorHandler);
  // Connect to Redis
  console.log("Server is ready!");

  const PORT: number = Number(process.env.PORT) || 5000;
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
