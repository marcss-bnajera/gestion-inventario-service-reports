'use strict';

export const validateLimit = (req, res, next) => {
    const { limit } = req.query;
    if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 10000)) {
        return res.status(400).json({
            success: false,
            message: 'El parametro limit debe ser un numero entre 1 y 10000',
            error: 'INVALID_PARAMETER',
        });
    }
    if (limit) {
        req.query.limit = parseInt(limit);
    }
    next();
};

export const validateThreshold = (req, res, next) => {
    const { threshold } = req.query;
    if (threshold && (isNaN(threshold) || parseInt(threshold) < 0)) {
        return res.status(400).json({
            success: false,
            message: 'El parametro threshold debe ser un numero mayor o igual a 0',
            error: 'INVALID_PARAMETER',
        });
    }
    if (threshold) {
        req.query.threshold = parseInt(threshold);
    }
    next();
};
