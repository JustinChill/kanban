import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import routes from './routes/index.js';
import { syncModels } from './models/index.js';
import { seedUsers } from './seeds/user-seeds.js';
import { sequelize } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const distPath = path.join(rootDir, 'client', 'dist');

console.log('Starting server initialization...');
console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER
});

const app = express();
const PORT = process.env.PORT || 3002;

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something broke!',
    error: err.message || 'Unknown error'
  });
  next(err);
});

// Parse JSON bodies
app.use(express.json());

// API routes
app.use('/api', routes);

// Serve static files from the React app
app.use(express.static(distPath));

// Handle React routing, return all requests to React app
app.get('/*', (_req, res): void => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  
  try {
    if (!existsSync(indexPath)) {
      console.error('index.html not found at:', indexPath);
      res.status(404).send('Application files not found');
      return;
    }
    res.sendFile(indexPath);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Error serving application files');
  }
});

// Start server and initialize database
console.log('Starting server...');
const server = app.listen(PORT, () => {
  console.log(`✨ Server is running and listening on port ${PORT} ✨`);
  console.log(`API endpoint: http://localhost:${PORT}/api`);
});

// Handle server errors
server.on('error', (error: any) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

// Initialize database
const initializeDatabase = async () => {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    console.log('Attempting to sync database models...');
    await syncModels();
    console.log('Database synced successfully');
    
    try {
      console.log('Attempting to seed users...');
      await seedUsers();
      console.log('Database seeded successfully');
    } catch (error) {
      console.log('Note: Users may already exist in database');
    }

    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't exit process, just log the error
    console.error('Server will continue running but database features may not work');
  }
};

// Initialize database in the background
initializeDatabase();
