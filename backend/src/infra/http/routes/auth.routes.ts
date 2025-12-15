import { Router } from 'express';

import { login, refreshToken, registerClient } from '../controllers/auth.controller';
import { setupAdmin, checkSetupStatus } from '../controllers/setup.controller';
import upload from '../middlewares/upload';
import asyncHandler from '../middlewares/async-handler';

const authRoutes = Router();

// Setup inicial (deve ser antes das outras rotas)
authRoutes.get('/setup/status', asyncHandler(checkSetupStatus));
authRoutes.post('/setup', asyncHandler(setupAdmin));

authRoutes.post('/login', asyncHandler(login));
authRoutes.post('/register', upload.single('logo'), asyncHandler(registerClient));
authRoutes.post('/refresh', asyncHandler(refreshToken));

export default authRoutes;

