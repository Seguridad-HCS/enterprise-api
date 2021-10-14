import { Router } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const router = Router();

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
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'Corporativo de seguridad HCS',
        url: 'https://www.seguridadhcs.com/'
      }
    },
    servers: [
      {
        url: 'http://localhost:1025/api',
        description: 'Development server'
      },
      {
        url: 'https://hcseagle.com/api',
        description: 'Production server'
      }
    ]
  },
  apis: ['./src/docs/*.yml']
};
const specs = swaggerJsdoc(options);
router.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(specs, { explorer: true })
);
export default router;
