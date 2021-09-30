import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Location from 'models/Location.model';

export default async(req:Request, res:Response) => {
    try {
        const location = new Location();
        await location.getLocation(req.params.locationId);
        await location.remove();
        res.status(200).json({
            server: 'Locacion eliminada'
        });
    } catch(e) {
        if(e instanceof Error) {
            console.log(e);
            res.status(500).json({
                server: 'Error en el server'
            });
        }
    }
}