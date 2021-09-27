import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Location from 'models/Location.model';
export default async (req: Request, res: Response) => {
    try {
        const location = new Location();
        const data = await location.getLocation(parseInt(req.params.locationId));
        res.status(200).json({ location:data })
    } catch (e) {
        if (e instanceof Error) res.status(500).json({
            server: e.message
        });
    }
}