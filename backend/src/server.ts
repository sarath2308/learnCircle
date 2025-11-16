import express from "express";
import { json, urlencoded } from "express";
import dotenv from "dotenv";
import { createDatabase } from "./config/db/dbFactory";
import { connectRedis } from "./config/redis/redis";
import expressWinston from "express-winston";
import logger from "./logs.config/logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware";

// Inversify Dependency Injection
import { container } from "./config/inversify/inversify.config";
import { TYPES } from "./types/shared/inversify/types";

// Professional Controllers and Routes
import { authorizeRoles } from "./middleware";
import { ROLE } from "./constants/shared/Role";
import { IAuthenticateMiddleware } from "./interface/shared/IAuthenticateMiddleware";
import { adminEntryRoute } from "./routes/admin/admin.entry.route";
import { learnerEntryRoute } from "./routes/learner/learner.entry.route";
import { professionalEntryRoute } from "./routes/professional/professional.entry.route";
import { authEntryRoute } from "./routes/shared/auth.entry.route";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Middleware
app.use(json());
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
    colorize: false,
  }),
);

async function startServer() {
  // Connect to MongoDB
  const db = createDatabase(process.env.DB_TYPE!, { uri: process.env.DB_URI });
  await db.connect();
  console.log("MongoDB connected");

  const authenticate = container.get<IAuthenticateMiddleware>(TYPES.IAuthenticateMiddleware);

  // Routes

  app.use("/api/auth", authEntryRoute());

  app.use(
    "/api/learner",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER),
    learnerEntryRoute(),
  );

  app.use(
    "/api/professional",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.PROFESSIONAL),
    professionalEntryRoute(),
  );

  app.use(
    "/api/admin",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN),
    adminEntryRoute(),
  );

  app.use(
    expressWinston.errorLogger({
      winstonInstance: logger,
      msg: "ERROR {{req.method}} {{req.url}} => {{err.message}}",
    }),
  );

  app.use(errorHandler);
  // Connect to Redis
  await connectRedis();
  console.log("Server is ready!");

  const PORT: number = Number(process.env.PORT) || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
