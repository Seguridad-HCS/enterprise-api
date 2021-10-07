import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Location from 'models/Location.model';
import removeUndefined from 'helpers/removeUndefined.helper';
import { ValidationError } from 'class-validator';
import logger from 'logger';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const location = new Location(req.body);
    await getRepository(Location)
      .save(location)
      .then(() => {
        res.status(201).json({
          server: 'Locacion creada',
          location: location.formatLocation()
        });
      })
      .catch((err) => {
        if (Array.isArray(err) && err[0] instanceof ValidationError) {
          const valErrors = removeUndefined(err);
          res.status(400).json({
            server: 'Error en el input',
            errores: valErrors
          });
        } else if (['22P02', '23502'].includes(err.code))
          res.status(404).json({
            server: 'Llaves foraneas invalidas o incorrectas'
          });
        else if ('23505' === err.code)
          res.status(405).json({
            server:
              'Alguno de los siguientes campos (nombre) ya han sido registrados en el sistema'
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
      logger.error(err);
      res.status(500).json({
        server: 'Error interno en el servidor'
      });
    }
  }
};
