import express from "express";
import dotenv from "dotenv";
import { createDatabase } from "./config/db/dbFactory";
import { connectRedis } from "./config/redis/redis";
import expressWinston from "express-winston";
import logger from "./logs/logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticate } from "./common/middleware";
import { errorHandler } from "./common/middleware";
import { IAuthController } from "@/common";

// Inversify Dependency Injection
import { container } from "./config/inversify/inversify.config";
import { TYPES } from "./common/types/inversify/types";

// Common
import { RefreshController } from "./common/controller";
import { refreshRoutes } from "@/common";

// Learner Controllers and Routes
import { learnerHomeRoute } from "@/learner";
import { LearnerHomeController } from "@/learner";
import { LearnerProfileController } from "@/learner";
import { learnerProfileRoute } from "@/learner";
// Professional Controllers and Routes
import { authorizeRoles } from "./common/middleware";
import { profesionalVerificationRoutes } from "@/professionals";
import { ProfesionalVerificationController } from "@/professionals";
import { authRoutes } from "./common/routes/auth.routes";

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

  // Resolved controllers
  // const learnerHomeController = container.get<LearnerHomeController>(TYPES.ILearnerHomeController);

  // const learnerProfileController = container.get<LearnerProfileController>(
  //   TYPES.ILearnerProfileController,
  // );
  // const profesionalVerificationController = container.get<ProfesionalVerificationController>(
  //   TYPES.IProfesionalVerificationController,
  // );
  //refresh controller
  const refreshController = container.get<RefreshController>(TYPES.IRefreshController);
  const authController = container.get<IAuthController>(TYPES.IAuthController);
  // Routes
  // app.use(
  //   "/api/learner/home",
  //   authenticate,
  //   authorizeRoles("learner"),
  //   learnerHomeRoute(learnerHomeController),
  // );
  app.use("/api/auth", authRoutes(authController));
  // app.use(
  //   "/api/learner/profile",
  //   authenticate,
  //   authorizeRoles("learner"),
  //   learnerProfileRoute(learnerProfileController),
  // );
  app.use("/api/auth", refreshRoutes(refreshController));

  //profesional routes
  // app.use(
  //   "/api/profesional",
  //   authenticate,
  //   authorizeRoles("profesional"),
  //   profesionalVerificationRoutes(profesionalVerificationController),
  // );
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
