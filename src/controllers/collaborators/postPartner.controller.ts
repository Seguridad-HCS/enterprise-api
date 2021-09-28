import { Request, Response } from 'express';
import Partner from 'models/Partner.model';

export default async(req:Request, res:Response) => {
    try {
        const partner = new Partner(req.body);
        await partner.save();
        res.status(201).json({
            server: 'Socio creado',
            partner
        });
    } catch(e) {
        if(e instanceof Error) {
            console.trace(e);
            res.status(500).json({
                server: 'Error interno en el servidor'
            });
        }
    }
}