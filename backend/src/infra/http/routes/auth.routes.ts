import { Router } from 'express';

import { login, refreshToken, registerClient } from '../controllers/auth.controller';
import upload from '../middlewares/upload';
import asyncHandler from '../middlewares/async-handler';

const authRoutes = Router();

authRoutes.post('/login', asyncHandler(login));
authRoutes.post('/register', upload.single('logo'), asyncHandler(registerClient));
authRoutes.post('/refresh', asyncHandler(refreshToken));

export default authRoutes;

