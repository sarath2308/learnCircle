import express from 'express';
import dotenv from 'dotenv';
import { createDatabase } from './config/db/dbFactory.js';
import { connectRedis } from './config/redis/redis.js';

//-----imports-------------------------
//global services
import { AccessToken } from './utils/access.jwt.js';
import { GenerateOtp } from './utils/otp.utils..js';
import { EmailService } from './services/emailSercice.js';
import { PasswordService } from './services/passwordService.js';

//redis
import redisClient from './config/redis/redis.js';
import { RedisRepository } from './Repositories/redisRepo.js';

//learner
import { Learner } from './models/Learner.js';
import { LearnerRepo } from './Repositories/learner/learnerRepo.js';
import { learnerAuthRoutes } from './routes/learner/learnerAuth.js';
import { LearnerAuthController } from './controllers/learner/learnerAuthController.js';
import { LearnerAuthService } from './services/learner/learnerAuthService.js';

//admin
import { adminAuthRoutes } from './routes/admin/adminAuth.js';
import { AdminAuthController } from './controllers/admin/adminAuthController.js';

//profesional
import { ProfesionalAuthController } from './controllers/profesional/profesionalAuthController.js';
import { profesionalAuthRoutes } from './routes/profesional/profesionalAuth.js';




//usage-----------------------

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

//repository
const learnerRepo=new LearnerRepo(Learner)
const redisRepo=new RedisRepository<any>(redisClient)

//services
const accessToken=new AccessToken()
const emailService=new EmailService()
const generateOtp=new GenerateOtp()
const passwordService=new PasswordService()
const learnerAuthService=new LearnerAuthService(learnerRepo,emailService,generateOtp,accessToken,redisRepo,passwordService)

//controllers
  const learnerAuthController=new LearnerAuthController(learnerAuthService) 
  const adminAuthController=new AdminAuthController()
  const profesionalAuthController=new ProfesionalAuthController()
// auth Routes
app.use('/api/auth/learner', learnerAuthRoutes(learnerAuthController));
// app.use('/api/auth/profesional', profesionalAuthRoutes(profesionalAuthController));
// app.use('/api/auth/admin', adminAuthRoutes(adminAuthController));


// Connect db

const db = createDatabase(process.env.DB_TYPE!, { uri: process.env.DB_URI });
db.connect();


// Start server
const PORT: number = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectRedis(); 
  console.log('Server is ready!');

  app.listen(PORT|5000, () => console.log('Server running on http://localhost:5000'));
}

startServer();