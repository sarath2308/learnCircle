import express from "express";
import dotenv from "dotenv";
import { createDatabase } from "./config/db/dbFactory";
import { connectRedis } from "./config/redis/redis";
import expressWinston from "express-winston";
import logger from "./logs.config/logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./common/middleware";
import { IAuthController } from "@/common";

// Inversify Dependency Injection
import { container } from "./config/inversify/inversify.config";
import { TYPES } from "./common/types/inversify/types";

// Common
import { RefreshController } from "./common/controller";
import { refreshRoutes } from "@/common";

// Learner Controllers and Routes
import { learnerHomeRoute, learnerProfileRoute } from "@/learner";
// Professional Controllers and Routes
import { authorizeRoles } from "./common/middleware";
import { authRoutes } from "./common/routes/auth.routes";
import { ROLE } from "./common/constants/Role";
import { ILearnerProfileController } from "./learner/features/profile/interface/ILearnerProfileController";
import { IAuthenticateMiddleware } from "./common/interface/IAuthenticateMiddleware";
import { ILearnerHomeController } from "./learner/features/home/interface/ILearnerHomeController";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} | status: {{res.statusCode}} | responseTime: {{res.responseTime}}ms",
    requestWhitelist: ["body", "params", "query"], // remove headers
    responseWhitelist: ["body"],
    dynamicMeta: (req, res) => {
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

  //refresh controller
  const refreshController = container.get<RefreshController>(TYPES.IRefreshController);
  const authController = container.get<IAuthController>(TYPES.IAuthController);
  const learnerProfileController = container.get<ILearnerProfileController>(
    TYPES.ILearnerProfileController,
  );
  const learnerHomeController = container.get<ILearnerHomeController>(TYPES.ILearnerHomeController);
  const authenticate = container.get<IAuthenticateMiddleware>(TYPES.IAuthenticateMiddleware);
  // Routes

  app.use("/api/auth", authRoutes(authController));

  app.use(
    "/api/learner/profile",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER),
    learnerProfileRoute(learnerProfileController),
  );

  app.use("/api/auth", refreshRoutes(refreshController));

  app.use(
    "/api/learner/home",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER),
    learnerHomeRoute(learnerHomeController),
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
