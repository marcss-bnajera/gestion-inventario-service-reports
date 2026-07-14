'use strict';

export class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
    }
}

export const errorHandler = (err, req, res, next) => {
    console.error(`[Reports Service] ${err.message}`);

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err.code || 'OPERATIONAL_ERROR',
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token de autenticacion invalido',
            error: 'INVALID_TOKEN',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token de autenticacion expirado',
            error: 'TOKEN_EXPIRED',
        });
    }

    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
        return res.status(503).json({
            success: false,
            message: 'Servicio de inventario no disponible',
            error: 'SERVICE_UNAVAILABLE',
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        error: err.name || 'INTERNAL_SERVER_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
