'use strict';

import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.URI_MONGODB);
        console.log('Conexion a MongoDB exitosa - Reports Service');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};
