import { Request, Response } from 'express';

import Partner from 'models/Partner.model';

export default async(req:Request, res:Response) => {
    try {
        const partner = new Partner();
        await partner.getPartner(req.params.partnerId);
        if(partner.services !== undefined && partner.services.length > 0) res.status(405).json({
            server: 'No se puede eliminar un socio con servicios asociados'
        });
        else {
            await partner.remove();
            res.status(200).json({
                server: 'Socio eliminado'
            });
        }
    } catch(e) {
        if(e instanceof Error) {
            if(e.message === 'No partner') res.status(404).json({
                server: 'Socio no encontrado'
            });
            else {
                console.log(e);
                res.status(500).json({
                    server: 'Error interno en el servidor'
                });
            }
        }
    }
}