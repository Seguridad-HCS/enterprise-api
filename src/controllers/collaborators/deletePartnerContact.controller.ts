import { Request, Response } from 'express';
import logger from 'logger';
import Partner from 'models/Partner.model';
import PartnerContact from 'models/PartnerContact.model';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = new PartnerContact();
    const partner = new Partner();
    await contact.getContact(req.params.contactId);
    if (contact.partnerId === undefined) throw Error('No partner');
    await partner.getPartner(contact.partnerId);
    if (partner.canDeleteLastContact()) {
      await contact
        .remove()
        .then(() => {
          res.status(200).json({
            server: 'Contacto eliminado'
          });
        })
        .catch((err) => {
          logger.error(err);
          res.status(500).json({
            server: 'Error en la base de datos'
          });
        });
    } else {
      res.status(405).json({
        server:
          'Debe existir al menos un contacto si el socio tiene servicios activos'
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'No contact')
        res.status(404).json({
          server: 'Contacto no encontrado'
        });
      else if (err.message === 'No partner')
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
