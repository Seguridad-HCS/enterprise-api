import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import Employee from '../../models/Employee.model';
import { getRepository } from 'typeorm';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    req.user.lastLogin = undefined;
    res.status(200).json({
      server: 'Sesion finalizada'
    });
    await getRepository(Employee).save(req.user);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ server: 'Error interno en el servidor' });
    }
  }
};
