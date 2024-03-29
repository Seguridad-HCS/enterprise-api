import { Request, Response } from 'express';
import logger from 'logger';
import Partner from 'models/Partner.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const partner = new Partner();
    await partner.getPartner(req.params.partnerId);
    const response = await partner.getFullRegister();
    res.status(200).json({ partner: response });
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
