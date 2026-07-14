'use strict';

import axios from 'axios';

export const getLowStockProducts = async (req, res) => {
    try {
        const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL;
        const response = await axios.get(`${INVENTORY_URL}/products`, {
            params: { isActive: true, limit: 1000 },
        });

        const products = response.data.data || [];
        const lowStock = products.filter((p) => p.stock <= (p.minStock || 5));

        return res.status(200).json({
            success: true,
            data: lowStock,
            message: `Se encontraron ${lowStock.length} productos con stock bajo`,
            alertType: 'low-stock',
        });
    } catch (error) {
        console.error('Error al obtener productos con stock bajo:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener productos con stock bajo',
            error: error.message,
        });
    }
};

export const getOutOfStockProducts = async (req, res) => {
    try {
        const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL;
        const response = await axios.get(`${INVENTORY_URL}/products`, {
            params: { isActive: true, limit: 1000 },
        });

        const products = response.data.data || [];
        const outOfStock = products.filter((p) => p.stock === 0);

        return res.status(200).json({
            success: true,
            data: outOfStock,
            message: `Se encontraron ${outOfStock.length} productos agotados`,
            alertType: 'out-of-stock',
        });
    } catch (error) {
        console.error('Error al obtener productos agotados:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener productos agotados',
            error: error.message,
        });
    }
};
