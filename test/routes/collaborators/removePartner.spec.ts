import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';

import Partner from '../../../src/models/Partner.model';

const app = createServer();

describe('DELETE /api/collaborators/partners/<partnerId> - Elimina un socio', () => {
  let token: string;
  let partners: string[];
  before(async () => {
    await dbConnection();
    token = await getToken();
    // [0: no service, 1: service]
    partners = await getPartnerIds();
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Elimina a un socio del sistema', (done) => {
    request(app)
      .delete(`/api/collaborators/partners/${partners[0]}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Socio eliminado');
        done();
      });
  });
  it('404 - Socio no encontrado', (done) => {
    request(app)
      .delete(`/api/collaborators/partners/1`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Socio no encontrado');
        done();
      });
  });
  it('405 - No se puede eliminar un socio con servicios asociados', (done) => {
    request(app)
      .delete(`/api/collaborators/partners/${partners[1]}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'No se puede eliminar un socio con servicios asociados'
        );
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .delete(`/api/collaborators/partners/${partners[1]}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});

const getPartnerIds = async (): Promise<string[]> => {
  const partnerRepo = getRepository(Partner);
  const partners = await partnerRepo
    .createQueryBuilder('partner')
    .leftJoinAndSelect('partner.services', 'services')
    .getMany();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const aux1 = partners.find((prtn: Partner) => prtn.services!.length > 0);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const aux2 = partners.find((prtn: Partner) => prtn.services!.length == 0);
  if (!aux1 || !aux1.id) throw Error('No partner with service');
  if (!aux2 || !aux2.id) throw Error('No partner without service');
  const withService = aux2.id;
  const withoutService = aux1.id;
  return [withService, withoutService];
};
