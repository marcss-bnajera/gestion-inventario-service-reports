import { Router } from 'express';
import { getLowStockProducts, getOutOfStockProducts } from '../controllers/alert-controller.js';
import { validateJwt } from '../middlewares/validate-jwt.js';
import { validateThreshold } from '../middlewares/validate-params.js';

const router = Router();

router.get('/low-stock', validateJwt, validateThreshold, getLowStockProducts);
router.get('/out-of-stock', validateJwt, getOutOfStockProducts);

export default router;
