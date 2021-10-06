import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import * as hbs from 'handlebars';
import * as nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

const readFileAsync = promisify(fs.readFile);

import Employee from 'models/Employee.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const query = await getRepository(Employee)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.locationProfile', 'locProfile')
      .leftJoinAndSelect('locProfile.position', 'position')
      .where('user.email = :email', { email: req.body.email })
      .getOne();
    if (query != undefined) {
      const token = jwt.sign(
        { data: query.id },
        <string>process.env.SERVER_RECOVER,
        {
          expiresIn: '1h'
        }
      );
      await recoverAccountEmail(req.body.email, token);
    }
    res.status(200).json({
      server: 'Correo de recuperacion enviado al colaborador'
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        server: 'Error interno en el servidor'
      });
    }
  }
};

const recoverAccountEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const filePath = path.resolve(
    __dirname,
    '../../templates/email/collaboratorRecoverAccount.hbs'
  );
  const templatePath = path.resolve(
    __dirname,
    '../../templates/email/general.hbs'
  );
  const html = await readFileAsync(filePath, 'utf8');
  hbs.registerPartial('general', await readFileAsync(templatePath, 'utf8'));
  const content = hbs.compile(html)({ token });
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_MAIL,
      pass: process.env.EMAIL_PASS
    }
  });
  await transporter.sendMail({
    from: `HCS <${process.env.EMAIL_MAIL}>`,
    to: email,
    subject: `Safe Eagle | Restablecer cuenta`,
    html: content
  });
};
