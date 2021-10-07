import { Request, Response } from 'express';
import logger from 'logger';
import Service from 'models/Service.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const service = new Service();
    await service.getService(req.params.serviceId);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'No service')
        res.status(404).json({
          server: 'Servicio no encontrado'
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
