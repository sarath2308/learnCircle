import express from "express";
import dotenv from "dotenv";
import { createDatabase } from "./config/db/dbFactory";
import { connectRedis } from "./config/redis/redis";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/authorization";

// Inversify Dependency Injection
import { container } from "./config/inversify/inversify.config";
import { TYPES } from "./types/types";

// Common
import { RefreshController } from "./controllers/refreshController";
import { refreshRoutes } from "./routes/refresh.route";

// Learner Controllers and Routes
import { LearnerAuthController } from "./controllers/learner/learner.auth.controller";
import { learnerAuthRoutes } from "./routes/learner/learner.auth.routes.";
import { learnerHomeRoute } from "./routes/learner/learner.home.route.";
import { LearnerHomeController } from "./controllers/learner/learner.home.controller";
import { LearnerProfileController } from "./controllers/learner/learner.profile.controller";
import { learnerProfileRoute } from "./routes/learner/learner.profile.route";
// Professional Controllers and Routes
import { ProfesionalAuthController } from "./controllers/profesional/profesional.auth.controller";
import { profesionalAuthRoutes } from "./routes/profesional/profesionalAuth";
import { authorizeRoles } from "./middleware/authorizedRoles";
import { profesionalVerificationRoutes } from "./routes/profesional/profesionalVerificationRoutes";
import { ProfesionalVerificationController } from "./controllers/profesional/profesional.verification.controller";
import { AdminAuthController } from "./controllers/admin/adminAuthController";
import { adminAuthRoutes } from "./routes/admin/adminAuth";

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

async function startServer() {
  // Connect to MongoDB
  const db = createDatabase(process.env.DB_TYPE!, { uri: process.env.DB_URI });
  await db.connect();
  console.log("MongoDB connected");

  // Resolved controllers
  const learnerAuthController = container.get<LearnerAuthController>(TYPES.LearnerAuthController);
  const learnerHomeController = container.get<LearnerHomeController>(TYPES.LearnerHomeController);
  const profesionalAuthController = container.get<ProfesionalAuthController>(
    TYPES.ProfesionalAuthController,
  );
  const learnerProfileController = container.get<LearnerProfileController>(
    TYPES.LearnerProfileController,
  );
  const profesionalVerificationController = container.get<ProfesionalVerificationController>(
    TYPES.ProfesionalVerificationController,
  );
  const adminAuthController = container.get<AdminAuthController>(TYPES.AdminAuthController);
  //refresh controller
  const refreshController = container.get<RefreshController>(TYPES.RefreshController);
  // Routes
  app.use("/api/auth/learner", learnerAuthRoutes(learnerAuthController));
  app.use(
    "/api/learner/home",
    authenticate,
    authorizeRoles("learner"),
    learnerHomeRoute(learnerHomeController),
  );
  app.use(
    "/api/learner/profile",
    authenticate,
    authorizeRoles("learner"),
    learnerProfileRoute(learnerProfileController),
  );
  app.use("/api/auth", refreshRoutes(refreshController));

  //profesional routes
  app.use("/api/auth/profesional", profesionalAuthRoutes(profesionalAuthController));
  app.use(
    "/api/profesional",
    authenticate,
    authorizeRoles("profesional"),
    profesionalVerificationRoutes(profesionalVerificationController),
  );
  //admin
  app.unsubscribe("/api/auth/admin", adminAuthRoutes(adminAuthController));
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
