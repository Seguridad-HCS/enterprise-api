import { Request, Response } from 'express';

import logger from 'logger';

import BillingProcess from 'models/BillingProcess.model';
import Partner from 'models/Partner.model';

import removeUndefined from 'helpers/removeUndefined.helper';
import { ValidationError } from 'class-validator';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const partner = new Partner();
    await partner.getPartner(req.params.partnerId);
    if (partner.billing == null)
      res.status(405).json({
        server: 'La informacion de facturacion general no ha sido actualizada'
      });
    else {
      if ((await partner.billing.getProcesses()).length + 1 > 5)
        res.status(405).json({
          server: 'Se ha alcanzado el numero maximo (5) de procesos de registro'
        });
      else {
        const process = new BillingProcess(req.body);
        partner.billing.processes?.push(process);
        await partner
          .save()
          .then(() => {
            delete process.billingId;
            res.status(201).json({
              server: 'Proceso de facturacion creado',
              process
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
