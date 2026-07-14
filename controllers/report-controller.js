'use strict';

import axios from 'axios';

export const getTopProducts = async (req, res) => {
    try {
        const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL;
        const outputsResponse = await axios.get(`${INVENTORY_URL}/outputs`, {
            params: { limit: 10000 },
        });

        const outputs = outputsResponse.data.data || [];

        const productCounts = {};
        outputs.forEach((output) => {
            const productId = output.product?._id || output.product;
            if (!productCounts[productId]) {
                productCounts[productId] = {
                    productId,
                    productName: output.product?.name || 'Desconocido',
                    totalQuantity: 0,
                    totalOutputs: 0,
                };
            }
            productCounts[productId].totalQuantity += output.quantity || 0;
            productCounts[productId].totalOutputs += 1;
        });

        const topProducts = Object.values(productCounts)
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 10);

        return res.status(200).json({
            success: true,
            data: topProducts,
            message: `Top ${topProducts.length} productos mas vendidos`,
            reportType: 'top-products',
        });
    } catch (error) {
        console.error('Error al obtener productos mas vendidos:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener productos mas vendidos',
            error: error.message,
        });
    }
};

export const getCategoriesSummary = async (req, res) => {
    try {
        const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL;
        const productsResponse = await axios.get(`${INVENTORY_URL}/products`, {
            params: { isActive: true, limit: 10000 },
        });

        const products = productsResponse.data.data || [];

        const categoryMap = {};
        products.forEach((product) => {
            const categoryId = product.category?._id || product.category;
            const categoryName = product.category?.name || 'Sin categoria';

            if (!categoryMap[categoryId]) {
                categoryMap[categoryId] = {
                    categoryId,
                    categoryName,
                    totalProducts: 0,
                    totalStock: 0,
                    totalValue: 0,
                };
            }
            categoryMap[categoryId].totalProducts += 1;
            categoryMap[categoryId].totalStock += product.stock || 0;
            categoryMap[categoryId].totalValue += (product.stock || 0) * (product.price || 0);
        });

        const categories = Object.values(categoryMap).sort((a, b) => b.totalProducts - a.totalProducts);

        return res.status(200).json({
            success: true,
            data: categories,
            message: `Resumen de ${categories.length} categorias`,
            reportType: 'categories',
        });
    } catch (error) {
        console.error('Error al obtener resumen por categorias:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener resumen por categorias',
            error: error.message,
        });
    }
};

export const getInventorySummary = async (req, res) => {
    try {
        const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL;
        const productsResponse = await axios.get(`${INVENTORY_URL}/products`, {
            params: { isActive: true, limit: 10000 },
        });

        const products = productsResponse.data.data || [];

        const totalProducts = products.length;
        const totalCategories = [...new Set(products.map((p) => p.category?._id || p.category))].length;
        const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
        const totalValue = products.reduce((sum, p) => sum + (p.stock || 0) * (p.price || 0), 0);
        const outOfStock = products.filter((p) => p.stock === 0).length;
        const lowStock = products.filter((p) => p.stock <= (p.minStock || 5)).length;

        return res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalCategories,
                totalStock,
                totalValue,
                outOfStock,
                lowStock,
                averageStockPerProduct: totalProducts > 0 ? Math.round(totalStock / totalProducts) : 0,
            },
            message: 'Resumen general del inventario',
            reportType: 'summary',
        });
    } catch (error) {
        console.error('Error al obtener resumen del inventario:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener resumen del inventario',
            error: error.message,
        });
    }
};
