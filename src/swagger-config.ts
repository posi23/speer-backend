import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Speer Notes Api - POSI',
            version: '1.0.0',
            description: 'API documentation for my Speer Notes REST API',
        },
        servers: [
            {
                url: 'https://https://speer-backend-p40p.onrender.com/',
                description: 'Production server'
            },
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
    },
    apis: ['./src/routes/*.ts'],
};

export default swaggerOptions;
