import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import LocationProfile from 'models/LocationProfile.model';

export default async(req:Request, res:Response) => {
    try {
        const profile = new LocationProfile();
        await profile.getLocationProfile(parseInt(req.params.profileId));
        if(profile.employees!.length > 0) throw Error('Still employees in location');
        await profile.remove();
        res.status(200).json({
            server: 'Perfil eliminado'
        });
    } catch(e) {
        if(e instanceof Error) {
            res.status(500).json({
                server: 'Error en el server'
            });
        }
    }
}