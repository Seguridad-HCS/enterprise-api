import { Request, Response } from 'express';
import logger from 'logger';

import Partner from 'models/Partner.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const partner = new Partner();
    await partner.getPartner(req.params.partnerId);
    if (partner.services !== undefined && partner.services.length > 0)
      res.status(405).json({
        server: 'No se puede eliminar un socio con servicios asociados'
      });
    else {
      await partner
        .remove()
        .then(() => {
          res.status(200).json({
            server: 'Socio eliminado'
          });
        })
        .catch((err) => {
          logger.error(err);
          res.status(500).json({
            server: 'Error en la base de datos'
          });
        });
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'No partner')
        res.status(404).json({
          server: 'Socio no encontrado'
        });
      else {
        logger.error(err);
        res.status(500).json({
          server: 'Error interno en el servidor'
        });
      }
    }
  }
};
