import express from "express";
import dotenv from "dotenv";
import { createDatabase } from "./config/db/dbFactory";
import { connectRedis } from "./config/redis/redis";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/authorization";

// Inversify Dependency Injection
import { container } from "./config/inversify/inversify.config"; // Import TYPES
import { TYPES } from "./types/types";

// Common
// import { RefreshController } from "./controllers/refreshController";
// import { refreshRoutes } from "./routes/refresh.route";

// Learner Controllers and Routes
import { LearnerAuthController } from "./controllers/learner/learner.auth.controller";
import { learnerAuthRoutes } from "./routes/learner/learnerAuth";
import { learnerHomeRoute } from "./routes/learner/LearnerHomeRoute";
import { LearnerHomeController } from "./controllers/learner/learner.home.controller";

// Professional Controllers and Routes
import { ProfesionalAuthController } from "./controllers/profesional/profesional.auth.controller";
import { profesionalAuthRoutes } from "./routes/profesional/profesionalAuth";
import { authorizeRoles } from "./middleware/authorizedRoles";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Middleware
app.use(express.json());
app.use(cookieParser());

async function startServer() {
  // Connect to MongoDB
  const db = createDatabase(process.env.DB_TYPE!, { uri: process.env.DB_URI });
  await db.connect();
  console.log("MongoDB connected");

  // Resolve controllers using TYPES identifiers
  const learnerAuthController = container.get<LearnerAuthController>(TYPES.LearnerAuthController);
  const learnerHomeController = container.get<LearnerHomeController>(TYPES.LearnerHomeController);
  const profesionalAuthController = container.get<ProfesionalAuthController>(
    TYPES.ProfesionalAuthController,
  );

  // Routes
  app.use("/api/auth/learner", learnerAuthRoutes(learnerAuthController));
  app.use("/api/auth/profesional", profesionalAuthRoutes(profesionalAuthController));

  app.use(authenticate);
  app.use("/api/learner/home", authorizeRoles("learner"), learnerHomeRoute(learnerHomeController));
  // app.use("/api/auth", refreshRoutes(refreshController));

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
