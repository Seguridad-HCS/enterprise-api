import { Request, Response } from 'express';
import Partner from 'models/Partner.model';

export default async (req: Request, res: Response) => {
  try {
    const partners = new Partner();
    const query = await partners.getAllPartners();
    res.status(200).json({
      server: 'Lista de socios',
      partners: query
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        server: 'Error interno en el servidor'
      });
    }
  }
};
