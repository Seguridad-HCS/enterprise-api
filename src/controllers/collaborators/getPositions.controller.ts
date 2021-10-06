import { Request, Response } from 'express';
import Position from 'models/Position.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const positions = new Position();
    const query = await positions.getAllPositions();
    res.status(200).json({
      server: 'Listado de posiciones',
      positions: query
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        server: 'Error interno en el servidor'
      });
    }
  }
};
