import express from 'express';
//import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { getProfile, login, register } from '../controllers/authcontroller.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/profile', protect, getProfile);

export default authRoutes;