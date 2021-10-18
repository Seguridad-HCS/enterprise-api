import { getRepository } from 'typeorm';

import Partner from '../../src/models/Partner.model';

export default async (): Promise<Partner> => {
  const partnerRepo = getRepository(Partner);
  const partner = await partnerRepo
    .createQueryBuilder('partner')
    .where('partner.billing IS NOT NULL')
    .getOne();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (!partner || !partner.id) throw Error('No partner with none billing');
  return partner;
};
