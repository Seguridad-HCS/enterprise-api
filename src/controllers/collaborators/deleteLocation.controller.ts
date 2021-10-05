import { Request, Response } from 'express';
import { getRepository, QueryFailedError } from 'typeorm';

import Location from 'models/Location.model';

export default async (req: Request, res: Response) => {
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
      .catch((err: any) => {
        if (['23503'].includes(err.code))
          res.status(405).json({
            server: 'La locacion aun cuenta con colaboradores activos'
          });
        else
          res.status(500).json({
            server: 'Error en la base de datos'
          });
      });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'No location')
        res.status(404).json({
          server: 'Locacion no encontrada'
        });
      else
        res.status(500).json({
          server: 'Error en el server'
        });
    }
  }
};
