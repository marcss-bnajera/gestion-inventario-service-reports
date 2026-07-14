import { Router } from 'express';
import {
    getTopProducts,
    getCategoriesSummary,
    getInventorySummary,
} from '../controllers/report-controller.js';
import { validateJwt } from '../middlewares/validate-jwt.js';
import { validateLimit } from '../middlewares/validate-params.js';

const router = Router();

router.get('/top-products', validateJwt, validateLimit, getTopProducts);
router.get('/categories', validateJwt, getCategoriesSummary);
router.get('/summary', validateJwt, getInventorySummary);

export default router;
