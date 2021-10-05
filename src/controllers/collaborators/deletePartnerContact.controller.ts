import { Request, Response } from 'express';
import Partner from 'models/Partner.model';
import PartnerContact from 'models/PartnerContact.model';

export default async (req: Request, res: Response) => {
  try {
    const contact = new PartnerContact();
    const partner = new Partner();
    await contact.getContact(req.params.contactId);
    await partner.getPartner(contact.partnerId!);
    if (partner.canDeleteLastContact()) {
      await contact
        .remove()
        .then(() => {
          res.status(200).json({
            server: 'Contacto eliminado'
          });
        })
        .catch((err: any) => {
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
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'No contact')
        res.status(404).json({
          server: 'Contacto no encontrado'
        });
      else {
        console.log(e);
        res.status(500).json({
          server: 'Error interno en el servidor'
        });
      }
    }
  }
};
