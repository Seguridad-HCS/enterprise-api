import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Location from 'models/Location.model';

export default async (req: Request, res: Response) => {
  try {
    const locations = new Location();
    let query: any;
    if (!req.query.owner) query = await locations.getAllLocations();
    if (parseInt(req.query.owner as string) === 1)
      query = locations.formatLocations(await getCollabLocations());
    else query = locations.formatLocations(await getHCSLocations());
    res.status(200).json({
      server: 'Lista de instalaciones',
      locations: query
    });
  } catch (e) {
    res.status(500).json({ server: 'Error en el server' });
  }
};

const getHCSLocations = async () => {
  const query = await getRepository(Location)
    .createQueryBuilder('location')
    .leftJoinAndSelect('location.address', 'address')
    .leftJoinAndSelect('location.profiles', 'profiles')
    .leftJoinAndSelect('profiles.employees', 'employees')
    .where('location.service IS NULL')
    .getMany();
  return query;
};
const getCollabLocations = async () => {
  const query = await getRepository(Location)
    .createQueryBuilder('location')
    .leftJoinAndSelect('location.address', 'address')
    .leftJoinAndSelect('location.profiles', 'profiles')
    .leftJoinAndSelect('profiles.employees', 'employees')
    .where('location.service IS NOT NULL')
    .getMany();
  return query;
};
