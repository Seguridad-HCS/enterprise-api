import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import logger from 'logger';
import Billing from 'models/Billing.model';
import Partner from 'models/Partner.model';
import removeUndefined from 'helpers/removeUndefined.helper';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const partner = new Partner();
    await partner.getPartner(req.params.partnerId);
    if (partner.billing === null) partner.billing = new Billing(req.body);
    else partner.billing?.update(req.body);
    await partner
      .save()
      .then(() => {
        delete partner.billing?.addressId;
        delete partner.billing?.id;
        res.status(200).json({
          server: 'Informacion de facturacion actualizada',
          billing: partner.billing
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
