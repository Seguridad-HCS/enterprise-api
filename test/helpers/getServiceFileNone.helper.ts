import { getRepository } from 'typeorm';

import Service from '../../src/models/Service.model';

export default async (): Promise<string[]> => {
  const servRepo = getRepository(Service);
  const service = await servRepo
    .createQueryBuilder('service')
    .leftJoinAndSelect('service.constitutiveAct', 'constitutiveAct')
    .leftJoinAndSelect('service.powerOfAttorney', 'powerOfAttorney')
    .leftJoinAndSelect('service.addressProof', 'addressProof')
    .leftJoinAndSelect('service.ine', 'ine')
    .where('service.constitutiveAct IS NULL')
    .orWhere('service.powerOfAttorney IS NULL')
    .orWhere('service.addressProof IS NULL')
    .orWhere('service.ine IS NULL')
    .getOne();
  if (!service || !service.id) throw Error('No none file');
  const fileName = getNoneFile(service);
  return [service.id, fileName];
};
const getNoneFile = (srv: Service): string => {
  if (!srv.constitutiveAct) return 'constitutiveAct';
  else if (!srv.powerOfAttorney) return 'powerOfAttorney';
  else if (!srv.addressProof) return 'addressProof';
  else if (!srv.ine) return 'ine';
  throw Error('No locked file');
};
