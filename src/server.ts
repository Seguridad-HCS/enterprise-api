import express, { Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import * as fs from 'fs';

import routes from 'routes/index';
import morganMiddleware from 'middlewares/morgan.middleWare';

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
        url: 'http://localhost:1025/'
      }
    ]
  },
  apis: ['./src/docs/*.yml']
};
const specs = swaggerJsdoc(options);

export default function createServer(): express.Application {
  if (!fs.existsSync(path.resolve(__dirname, '../../files'))) {
    fs.mkdirSync(path.resolve(__dirname, '../../files'));
  }
  const app: Application = express();
  dotenv.config();
  app.set('PORT', parseInt(<string>process.env.SERVER_PORT, 10) || 4000);
  if (process.env.NODE_ENV !== 'test') app.use(morganMiddleware);
  if (process.env.NODE_ENV === 'dev') {
    app.use(
      '/api-docs',
      swaggerUI.serve,
      swaggerUI.setup(specs, { explorer: true })
    );
  }
  app.use(express.static('public'));
  app.use(helmet());
  app.use(express.json());
  app.use(
    multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 100 * 1024 * 1024 } // Maximo 10mb por archivo
    }).single('file')
  );
  app.use(
    cors({
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      origin: '*',
      allowedHeaders: ['Content-Type', 'session'],
      exposedHeaders: ['Content-Type', 'Content-disposition', 'token']
    })
  );
  app.use(routes);
  return app;
}
