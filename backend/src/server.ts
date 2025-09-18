import express from "express";
import dotenv from "dotenv";
import { createDatabase } from "./config/db/dbFactory";
import { connectRedis } from "./config/redis/redis";
import cors from "cors";
import cookieParser from "cookie-parser";

//-----imports-------------------------
//global services
import { TokenService } from "./utils/token.jwt";
import { GenerateOtp } from "./utils/otp.utils.";
import { EmailService } from "./services/emailService";
import { PasswordService } from "./services/passwordService";
import { RefreshController } from "./controllers/refreshController";
import { RefreshTokenService } from "./services/refreshToken.service";
import { refreshRoutes } from "./routes/refresh.route";
//redis
import redisClient from "./config/redis/redis";
import { RedisRepository } from "./Repositories/redisRepo";

//learner
import { Learner } from "./models/Learner";
import { LearnerRepo } from "./Repositories/learner/learnerRepo";
import { learnerAuthRoutes } from "./routes/learner/learnerAuth";
import { LearnerAuthController } from "./controllers/learner/learnerAuthController";
import { LearnerAuthService } from "./services/learner/learnerAuthService";

//admin
// import { adminAuthRoutes } from "./routes/admin/adminAuth";
// import { AdminAuthController } from "./controllers/admin/adminAuthController";

//profesional
import { ProfesionalAuthController } from "./controllers/profesional/profesionalAuthController";
import { profesionalAuthRoutes } from "./routes/profesional/profesionalAuth";
import Professional from "./models/profesionals";
import { ProfesionalAuthService } from "./services/profesional/ProfesionalAuthService";
import { ProfesionalRepo } from "./Repositories/profesional/profesionalRepo";

//usage-----------------------

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies/auth headers
  }),
);

// Middleware
app.use(express.json());
app.use(cookieParser());

//repository
const learnerRepo = new LearnerRepo(Learner);
const redisRepo = new RedisRepository<any>(redisClient);
const profesionalRepo = new ProfesionalRepo(Professional);
//services
const accessToken = new TokenService();
const emailService = new EmailService();
const generateOtp = new GenerateOtp();
const passwordService = new PasswordService();
const learnerAuthService = new LearnerAuthService(
  learnerRepo,
  emailService,
  generateOtp,
  accessToken,
  redisRepo,
  passwordService,
);
const profesionalAuthService = new ProfesionalAuthService(
  profesionalRepo,
  emailService,
  generateOtp,
  accessToken,
  redisRepo,
  passwordService,
);

const refreshTokenService = new RefreshTokenService(accessToken, redisRepo);

//controllers
const learnerAuthController = new LearnerAuthController(learnerAuthService);
// const adminAuthController = new AdminAuthController();
const profesionalAuthController = new ProfesionalAuthController(profesionalAuthService);

const refreshController = new RefreshController(refreshTokenService);
// const profesionalAuthController=new ProfesionalAuthController()
// auth Routes
app.use("/api/auth/learner", learnerAuthRoutes(learnerAuthController));
app.use("/api/auth/profesional", profesionalAuthRoutes(profesionalAuthController));
app.use("/api/auth", refreshRoutes(refreshController));
// app.use('/auth/logout')
// app.use('/api/auth/admin', adminAuthRoutes(adminAuthController));

// Connect db

const db = createDatabase(process.env.DB_TYPE!, { uri: process.env.DB_URI });
db.connect();

// Start server
const PORT: number = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectRedis();
  console.log("Server is ready!");

  app.listen(PORT | 5000, () => console.log("Server running on http://localhost:5000"));
}

startServer();
