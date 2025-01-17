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
                url: 'http://localhost:3000', // Update with your server URL
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to your TypeScript API docs
};

export default swaggerOptions;
