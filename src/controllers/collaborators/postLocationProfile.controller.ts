import { Request, Response } from 'express';
import LocationProfile from 'models/LocationProfile.model';

export default async(req:Request, res:Response) => {
    try {
        const profile = new LocationProfile(req.body);
        await profile.save();
        res.status(201).json({
            server: 'Perfil creado',
            profile
        })
    } catch(e) {
        if(e instanceof Error) {
            console.log(e);
            res.status(500).json({
                server: 'Error interno en el servidor'
            });
        }
    }
}