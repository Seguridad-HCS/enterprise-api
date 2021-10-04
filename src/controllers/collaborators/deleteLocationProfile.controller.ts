import { Request, Response } from 'express';

import LocationProfile from 'models/LocationProfile.model';

export default async(req:Request, res:Response) => {
    try {
        const profile = new LocationProfile();
        await profile.getLocationProfile(req.params.profileId);
        if(profile.employees!.length > 0) throw Error('Still employees in profile');
        await profile.remove()
            .then(() => {
                res.status(200).json({
                    server: 'Perfil eliminado'
                });
            })
            .catch((err:any) => {
                res.status(500).json({
                    server: 'Error en la base de datos'
                });
            });
    } catch(e) {
        if (e instanceof Error) {
            if(e.message === 'No location profile') res.status(404).json({
                server: 'Perfil no encontrado'
            });
            else if(e.message === 'Still employees in profile') res.status(405).json({
                server: 'Hay colaboradores asociados a este perfil'
            });
            else res.status(500).json({
                server: 'Error interno en el servidor'
            });
        }
    }
}