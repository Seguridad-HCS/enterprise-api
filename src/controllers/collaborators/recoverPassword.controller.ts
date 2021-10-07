import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import logger from 'logger';
import Employee from 'models/Employee.model';
import { getRepository } from 'typeorm';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.headers.token) throw Error('Bad token');
    const payload = jwt.verify(
      req.headers.token as string,
      <string>process.env.SERVER_RECOVER
    ) as jwt.JwtPayload;
    const query = await getRepository(Employee)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.locationProfile', 'locProfile')
      .leftJoinAndSelect('locProfile.position', 'position')
      .where('user.id = :id', { id: payload.data })
      .getOne();
    if (!query) throw Error('Bad token');
    else {
      query.setPassword(req.body.password);
      logger.info(`${query.id} -> ${req.originalUrl}`);
      res.status(200).json({
        server: 'Contraseña modificada'
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Bad token' || err.message === 'invalid signature') {
        res.status(405).json({
          server: 'Token corrupto'
        });
      } else if (err.message === 'Regex') {
        res.status(400).json({
          server:
            'La contraseña debe contener al menos una mayuscula, una minuscula, un caracter especial (@$!%*?&) y una longitud entre 8 y 30 caracteres'
        });
      } else {
        logger.error(err);
        res.status(500).json({
          server: 'Error interno en el servidor'
        });
      }
    }
  }
};
