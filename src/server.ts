import express, { Application } from 'express';

import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import routes from 'routes/index';

// Swagger conf
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HCS - Enterpise API',
            version: '0.1.0',
            description:
                'Api creada para administrar la infresctructura de los endpoints disponibles dentro de HCS',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Corporativo de seguridad HCS',
                url: 'https://www.seguridadhcs.com/',
            },
        },
        servers: [{
            url: 'http://localhost:1025/',
        }],
    },
    apis: ['./src/routes/*.ts'],
};
const specs = swaggerJsdoc(options);

export default function createServer() {
    const app: Application = express();
    dotenv.config();
    app.set('PORT', parseInt(<string>process.env.SERVER_PORT, 10) || 4000);
    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('dev'));
    }
    if (process.env.NODE_ENV === 'dev') {
        app.use(
            '/api-docs',
            swaggerUI.serve,
            swaggerUI.setup(specs, { explorer: true })
        );
    }
    app.use(express.json());
    app.use(routes);
    return app;
}
