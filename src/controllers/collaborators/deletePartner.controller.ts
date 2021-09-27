import { Request, Response } from 'express';

import Partner from 'models/Partner.model';

export default async(req:Request, res:Response) => {
    try {
        const partner = new Partner();
        await partner.getPartner(req.params.partnerId);
        await partner.remove();
        res.status(200).json({
            server: 'Socio eliminado'
        });
    } catch(e) {
        if(e instanceof Error) {
            res.status(500).json({
                server: 'Error interno en el servidor'
            });
        }
    }
}