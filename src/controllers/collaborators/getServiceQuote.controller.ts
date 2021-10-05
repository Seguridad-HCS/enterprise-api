import { Request, Response } from 'express';
import Service from 'models/Service.model';

export default async (req: Request, res: Response) => {
  try {
    const service = new Service();
    await service.getService(req.params.serviceId);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'No service')
        res.status(404).json({
          server: 'Servicio no encontrado'
        });
      else
        res.status(500).json({
          server: 'Error interno en el servidor'
        });
    }
  }
};
