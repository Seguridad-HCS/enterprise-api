import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Location from 'models/Location.model';
export default async (req: Request, res: Response): Promise<void> => {
  try {
    const location = new Location();
    const query = await location.getLocation(req.params.locationId);
    console.log(query);
    res.status(200).json({ location: query });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === 'No location')
        res.status(404).json({
          server: 'Locacion no encontrada'
        });
      else
        res.status(500).json({
          server: 'Error interno en el servidor'
        });
    }
  }
};
