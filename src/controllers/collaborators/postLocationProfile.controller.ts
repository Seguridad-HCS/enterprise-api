import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import LocationProfile from 'models/LocationProfile.model';
import removeUndefined from 'helpers/removeUndefined.helper';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = new LocationProfile(req.body);
    await profile
      .save()
      .then(() =>
        res.status(201).json({
          server: 'Perfil creado',
          profile
        })
      )
      .catch((err) => {
        if (Array.isArray(err) && err[0] instanceof ValidationError) {
          const valErrors = removeUndefined(err);
          res.status(400).json({
            server: 'Error en el input',
            errores: valErrors
          });
        }
        if (['22P02', '23502'].includes(err.code))
          res.status(404).json({
            server: 'Llaves foraneas invalidas o incorrectas'
          });
        else
          res.status(500).json({
            server: 'Error en la base de datos'
          });
      });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        server: 'Error interno en el servidor'
      });
    }
  }
};
