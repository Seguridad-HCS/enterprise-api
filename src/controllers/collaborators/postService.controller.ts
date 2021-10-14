import { Request, Response } from 'express';
import logger from 'logger';
import Partner from 'models/Partner.model';
import Service from 'models/Service.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const partner = new Partner();
    await partner.getPartner(req.body.partner);
    if (await partner.canCreateService()) {
      const service = new Service(req.body);
      await service.save().then(() => {
        res.status(201).json({
          server: 'Servicio creado',
          service
        });
      });
    } else
      res.status(405).json({
        server: 'Ya hay un servicio en proceso'
      });
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
