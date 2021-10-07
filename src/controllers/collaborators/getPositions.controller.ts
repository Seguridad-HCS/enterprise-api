import { Request, Response } from 'express';
import logger from 'logger';
import Position from 'models/Position.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const positions = new Position();
    const query = await positions.getAllPositions();
    res.status(200).json({
      server: 'Listado de posiciones',
      positions: query
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err);
      res.status(500).json({
        server: 'Error interno en el servidor'
      });
    }
  }
};
