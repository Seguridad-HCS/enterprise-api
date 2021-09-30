import { Request, Response } from 'express';
import LocationProfile from 'models/LocationProfile.model';

export default async(req:Request, res:Response) => {
    try {
        const profile = new LocationProfile(req.body);
        await profile.save()
            .then(() => res.status(201).json({
                server: 'Perfil creado',
                profile
            }))
            .catch(err => {
                if(err.code === '22P02') res.status(404).json({
                    server: 'Relaciones externas no encontradas'
                });
                else res.status(500).json({
                    server: 'Error en la base de datos'
                })
            });
    } catch(e) {
        if(e instanceof Error) {
            res.status(500).json({
                server: 'Error interno en el servidor'
            });
        }
    }
}