import express from 'express';
import dotenv from 'dotenv';
import { createDatabase } from './config/db/dbFactory.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
// app.use('/api', routes);


// Connect db

const db = createDatabase(process.env.DB_TYPE!, { uri: process.env.DB_URI });
db.connect();


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
