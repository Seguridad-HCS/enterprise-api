import logger from 'logger';
import createServer from 'server';
import dbConnection from 'dbConnection';

const startServer = async () => {
  const app = createServer();
  await dbConnection();
  app.listen(app.get('PORT'), () => {
    logger.info(`Server running on port ${app.get('PORT')}`);
  });
};

startServer();
