import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Filling API Documentation',
            version: '1.0.0',
            description: 'Documentation for E-Filling REST API',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://your-vercel-app-name.vercel.app'
                    : 'http://localhost:3000',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

export const specs = swaggerJsdoc(options);