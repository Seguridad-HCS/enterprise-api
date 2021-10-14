import express, { Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import * as fs from 'fs';
import morgan from 'morgan';

import routes from 'routes/index';
import swaggerSetup from 'docs/swaggerSetup.doc';
import morganMiddleware from 'middlewares/morgan.middleWare';

export default function createServer(): express.Application {
  dotenv.config();
  if (!fs.existsSync(path.resolve(__dirname, '../../files'))) {
    fs.mkdirSync(path.resolve(__dirname, '../../files'));
  }
  const app: Application = express();
  app.set('PORT', parseInt(<string>process.env.SERVER_PORT, 10) || 4000);
  if (process.env.NODE_ENV === 'prod') app.use(morganMiddleware);
  if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
    app.use(swaggerSetup);
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
  app.use('/api', routes);
  return app;
}
