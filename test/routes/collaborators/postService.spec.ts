import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';
import Partner from '../../../src/models/Partner.model';

const app = createServer();

describe('POST /api/collaborators/service - Ruta de creacion de servicio', () => {
  let token: string;
  let partnerIds: string[];
  before(async () => {
    await dbConnection();
    token = await getToken();
    // [0: no billing, 1: billing]
    partnerIds = await getPartnerIds();
  });
  after(async () => {
    await getConnection().close();
  });
  it('201 - Servicio creado exitosamente', (done) => {
    request(app)
      .post('/api/collaborators/services')
      .set('token', token)
      .send({
        partner: partnerIds[0]
      })
      .expect('Content-type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Servicio creado');
        expect(res.body.service.id).to.be.a('string');
        done();
      });
  });
  it('404 - El socio no fue encontrado', (done) => {
    // TODO especificar el objeto que se recibe
    request(app)
      .post('/api/collaborators/services')
      .set('token', token)
      .send({
        partner: 'thisisatest'
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Socio no encontrado');
        done();
      });
  });
  it('405 - Ya hay un servicio en proceso', (done) => {
    request(app)
      .post('/api/collaborators/services')
      .set('token', token)
      .send({
        partner: partnerIds[1]
      })
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Ya hay un servicio en proceso');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .post(`/api/collaborators/services`)
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
