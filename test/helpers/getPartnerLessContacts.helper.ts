import { getRepository } from 'typeorm';

import Partner from '../../src/models/Partner.model';

export default async (): Promise<Partner> => {
  const partnerRepo = getRepository(Partner);
  const partners = await partnerRepo
    .createQueryBuilder('partner')
    .leftJoinAndSelect('partner.contacts', 'contacts')
    .getMany();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const aux1 = partners.find((prtn) => prtn.contacts!.length < 5);
  if (!aux1 || !aux1.id) throw Error('No partner with less contacts');
  return aux1;
};
