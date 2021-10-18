import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Employee from 'models/Employee.model';
import logger from 'logger';

dotenv.config();

export default async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body || !req.body.email || !req.body.password)
      throw Error('Faltan campos');
    const query = await getRepository(Employee)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.locationProfile', 'locProfile')
      .leftJoinAndSelect('locProfile.position', 'position')
      .where('user.email = :email', { email: req.body.email })
      .getOne();
    if (query == undefined || !compare(req.body.password, query.password))
      res.status(404).json({
        server: 'Usuario no encontrado'
      });
    else {
      const token = jwt.sign(
        { data: query.id },
        <string>process.env.SERVER_TOKEN,
        {
          expiresIn: '1h'
        }
      );
      res
        .status(200)
        .header({ token })
        .json({
          server: 'Inicio exitoso',
          name: `${query.name} ${query.surname}`,
          role: `${query.locationProfile?.position?.name}`
        });
      const { iat } = jwt.verify(
        token,
        <string>process.env.SERVER_TOKEN
      ) as jwt.JwtPayload;
      query.lastLogin = iat;
      await getRepository(Employee).save(query);
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message == 'Bad entry')
        res.status(501).json({
          server: err.message
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

const compare = (password: string, originalPassword: string | undefined) => {
  if (originalPassword === undefined) return false;
  return bcrypt.compareSync(password, originalPassword);
};
