import { Request, Response } from 'express';
import Employee from '../../models/Employee.model';
import { getRepository } from 'typeorm';
import logger from 'logger';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    req.user.lastLogin = undefined;
    res.status(200).json({
      server: 'Sesion finalizada'
    });
    await getRepository(Employee).save(req.user);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err);
      res.status(500).json({ server: 'Error interno en el servidor' });
    }
  }
};
