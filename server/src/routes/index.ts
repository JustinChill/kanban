import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Auth routes (public)
router.use('/auth', authRoutes);

// Protected API routes
router.use('/', authenticateToken, apiRoutes);

export default router;
