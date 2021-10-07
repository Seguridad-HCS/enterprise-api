import { Request, Response } from 'express';

import Location from 'models/Location.model';
import logger from 'logger';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const location = new Location();
    await location.getLocation(req.params.locationId);
    await location
      .remove()
      .then(() => {
        res.status(200).json({
          server: 'Locacion eliminada'
        });
      })
      .catch((err) => {
        if (['23503'].includes(err.code))
          res.status(405).json({
            server: 'La locacion aun cuenta con colaboradores activos'
          });
        else {
          logger.error(err);
          res.status(500).json({
            server: 'Error en la base de datos'
          });
        }
      });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'No location')
        res.status(404).json({
          server: 'Locacion no encontrada'
        });
      else {
        logger.error(err);
        res.status(500).json({
          server: 'Error en el server'
        });
      }
    }
  }
};
