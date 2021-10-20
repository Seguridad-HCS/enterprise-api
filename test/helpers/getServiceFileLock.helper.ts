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
    .where('constitutiveAct.lock = :lock', { lock: true })
    .orWhere('powerOfAttorney.lock = :lock', { lock: true })
    .orWhere('addressProof.lock = :lock', { lock: true })
    .orWhere('ine.lock = :lock', { lock: true })
    .getOne();
  if (!service || !service.id) throw Error('No locked file');
  const fileName = getLockedFile(service);
  return [service.id, fileName];
};
const getLockedFile = (srv: Service): string => {
  if (srv.constitutiveAct && srv.constitutiveAct.lock) return 'constitutiveAct';
  else if (srv.powerOfAttorney && srv.powerOfAttorney.lock)
    return 'powerOfAttorney';
  else if (srv.addressProof && srv.addressProof.lock) return 'addressProof';
  else if (srv.ine && srv.ine.lock) return 'ine';
  throw Error('No locked file');
};
