'use strict';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { corsOptions } from './cors-configuration.js';
import helmet from 'helmet';
import { helmetConfiguration } from './helmet-configuration.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import { dbConnection } from './db.js';

import alertRoutes from '../routes/alert-routes.js';
import reportRoutes from '../routes/report-routes.js';

const BASE_PATH = '/gestionInventario/v1';

const middlewares = (app) => {
    app.use(helmet(helmetConfiguration));
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(requestLimit);
    app.use(morgan('dev'));
};

const routes = (app) => {
    app.use(`${BASE_PATH}/alerts`, alertRoutes);
    app.use(`${BASE_PATH}/reports`, reportRoutes);
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3002;

    app.set('trust proxy', 1);

    try {
        await dbConnection();
        middlewares(app);

        app.get(`${BASE_PATH}/health`, (req, res) => {
            res.status(200).json({
                status: 'OK',
                service: 'Gestion de Inventario - Alertas y Reportes API',
                version: '1.0.0',
            });
        });

        routes(app);

        app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
                error: 'NOT_FOUND',
            });
        });

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Reports Server running on port ${PORT}`);
            console.log(`URL BASE: http://localhost:${PORT}${BASE_PATH}`);
        });
    } catch (err) {
        console.error(`Error starting Reports Server: ${err.message}`);
        process.exit(1);
    }
};
