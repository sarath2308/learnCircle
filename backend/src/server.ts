import express from 'express';
import dotenv from 'dotenv';
import { createDatabase } from './config/db/dbFactory.js';
//auth routes 
import { learnerAuthRoutes } from './routes/learner/learnerAuth.js';
import { adminAuthRoutes } from './routes/admin/adminAuth.js';
import { profesionalAuthRoutes } from './routes/profesional/profesionalAuth.js';

//auth controller
import { LearnerAuthController } from './controllers/learner/learnerAuthController.js';
import { AdminAuthController } from './controllers/admin/adminAuthController.js';
import { ProfesionalAuthController } from './controllers/profesional/profesionalAuthController.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

//repository

//services

//controllers
  const learnerAuthController=new LearnerAuthController() 
  const adminAuthController=new AdminAuthController()
  const profesionalAuthController=new ProfesionalAuthController()
// auth Routes
app.use('/api/auth/learner', learnerAuthRoutes(learnerAuthController));
app.use('/api/auth/profesional', profesionalAuthRoutes(profesionalAuthController));
app.use('/api/auth/admin', adminAuthRoutes(adminAuthController));


// Connect db

const db = createDatabase(process.env.DB_TYPE!, { uri: process.env.DB_URI });
db.connect();


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
