import { Request, Response } from 'express';
import Service from 'models/Service.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const service = new Service();
    const query = await service.getService(req.params.serviceId);
    res.status(200).json({ partner: query });
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
