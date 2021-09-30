import { Request, Response } from 'express';
import Partner from 'models/Partner.model';
import PartnerContact from 'models/PartnerContact.model';
import removeUndefined from 'helpers/removeUndefined.helper';

export default async(req:Request, res:Response) => {
    try {
        const partner = new Partner();
        await partner.getPartner(req.body.partner);
        if(partner.contacts === undefined || partner.contacts.length + 1 > 5) res.status(405).json({
            server: 'Se ha alcanzado el numero maximo de registros'
        });
        else {
            const contact = new PartnerContact(req.body);
            await contact.save()
                .then(() => {
                    const response = contact.formatContact();
                    res.status(201).json({
                        server: 'Contacto creado',
                        contact: response
                    });
                })
                .catch(e => {
                    const valErrors = removeUndefined(e);
                    res.status(400).json({
                        server: 'Errores en el input',
                        errores: valErrors
                    });
                });
        }
    } catch(e) {
        if(e instanceof Error) {
            if(e.message === 'No partner') res.status(404).json({
                server: 'Socio no encontrado'
            });
            else res.status(500).json({
                server: 'Error interno en el servidor'
            });
        }
    }
}