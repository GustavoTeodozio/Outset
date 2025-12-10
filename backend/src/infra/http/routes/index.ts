import { Router } from 'express';

import authRoutes from './auth.routes';
import clientRoutes from './client.routes';
import adminRoutes from './admin.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/client', clientRoutes);
routes.use('/admin', adminRoutes);

export default routes;

