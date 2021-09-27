import { Request, Response } from 'express';
import Partner from 'models/Partner.model';

export default async(req:Request, res:Response) => {
    try {
        const partner = new Partner();
        const query = await partner.getPartner(req.params.partnerId);
        res.status(200).json({ partner: query });
    } catch(e) {
        if(e instanceof Error) {
            console.log(e);
            res.status(500).json({
                server: 'Error interno en el servidor'
            });
        }
    }
}