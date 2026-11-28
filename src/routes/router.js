import { Router } from 'express';
import ejsRoutes from './ejs-routes.js';
import apiRoutes from './api-routes.js';
const router = Router();
router.use(apiRoutes);
router.use(ejsRoutes);
export default router;
