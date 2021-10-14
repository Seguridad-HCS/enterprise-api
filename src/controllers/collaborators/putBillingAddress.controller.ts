import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import logger from 'logger';
import Billing from 'models/Billing.model';
import Partner from 'models/Partner.model';
import removeUndefined from 'helpers/removeUndefined.helper';
import BillingAddress from 'models/BillingAddress.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const partner = new Partner();
    await partner.getPartner(req.params.partnerId);
    if (partner.billing === null)
      res.status(405).json({
        server: 'La informacion de facturacion general no ha sido actualizada'
      });
    else {
      await partner.billing?.getAddress();
      if (partner.billing?.address === null)
        partner.billing.address = new BillingAddress(req.body);
      else partner.billing?.address?.update(req.body);
      await partner
        .save()
        .then(() => {
          delete partner.billing?.address?.id;
          res.status(200).json({
            server: 'Direccion de facturacion actualizada',
            address: partner.billing?.address
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
