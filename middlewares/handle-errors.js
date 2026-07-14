'use strict';

export const errorHandler = (err, req, res, next) => {
    console.error('Error no manejado:', err.message);

    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        error: err.name || 'INTERNAL_SERVER_ERROR',
    });
};
