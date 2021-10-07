import { Request, Response } from 'express';
import logger from 'logger';
import Partner from 'models/Partner.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const partners = new Partner();
    const query = await partners.getAllPartners();
    res.status(200).json({
      server: 'Lista de socios',
      partners: query
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
