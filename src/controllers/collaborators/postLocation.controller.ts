import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Location from 'models/Location.model';

export default async(req: Request, res: Response) => {
    try {
        const location = new Location(req.body);
        await getRepository(Location).save(location);
        res.status(201).json({
            server: 'Locacion creada',
            location
        });
    } catch(e) {
        if(e instanceof Error) {
            console.log(e);
            res.status(500).json({
                server: 'Error interno en el servidor'
            });
        }
    }
}