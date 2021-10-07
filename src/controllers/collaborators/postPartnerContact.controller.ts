import { Request, Response } from 'express';
import Partner from 'models/Partner.model';
import PartnerContact from 'models/PartnerContact.model';
import removeUndefined from 'helpers/removeUndefined.helper';
import { ValidationError } from 'class-validator';
import logger from 'logger';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const partner = new Partner();
    await partner.getPartner(req.body.partner);
    if (partner.contacts === undefined || partner.contacts.length + 1 > 5)
      res.status(405).json({
        server: 'Se ha alcanzado el numero maximo de registros'
      });
    else {
      const contact = new PartnerContact(req.body);
      await contact
        .save()
        .then(() => {
          const response = contact.formatContact();
          res.status(201).json({
            server: 'Contacto creado',
            contact: response
          });
        })
        .catch((err) => {
          if (Array.isArray(err) && err[0] instanceof ValidationError) {
            const valErrors = removeUndefined(err);
            res.status(400).json({
              server: 'Error en el input',
              errores: valErrors
            });
          } else if (['22P02', '23502'].includes(err.code))
            res.status(404).json({
              server: 'Llaves foraneas invalidas o incorrectas'
            });
          else {
            logger.error(err);
            res.status(500).json({
              server: 'Error en la base de datos'
            });
          }
        });
    }
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
