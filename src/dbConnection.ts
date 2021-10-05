import { createConnection } from 'typeorm';
import dotenv from 'dotenv';

export default async () => {
  dotenv.config();
  const dbConnnection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [__dirname + '/models/*']
  }).catch((err) => {
    console.trace(err);
    process.exit(0);
  });
  return dbConnnection;
};
