import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';
import Partner from '../../../src/models/Partner.model';

const app = createServer();

describe('GET /api/collaborators/partners/<partnerId> - Ruta para mostrar un socio en especifico', () => {
  let token: string;
  let partnerId: string;
  before(async () => {
    await dbConnection();
    token = await getToken();
    partnerId = await getPartnerId();
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Muestra el registro completo de un socio', (done) => {
    request(app)
      .get(`/api/collaborators/partners/${partnerId}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.partner.id).to.be.a('string');
        expect(res.body.partner.name).to.be.a('string');
        expect(res.body.partner.legalName).to.be.a('string');
        expect(res.body.partner.rfc).to.be.a('string');
        expect(res.body.partner.representative).to.be.a('string');
        expect(res.body.partner.phoneNumber).to.be.a('string');
        expect(res.body.partner.email).to.be.a('string');
        expect(res.body.partner.contacts).to.be.an('array');
        done();
      });
  });
  it('404 - El socio no fue encontrado', (done) => {
    request(app)
      .get(`/api/collaborators/partners/1`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Socio no encontrado');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get(`/api/collaborators/partners/${partnerId}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
const getPartnerId = async (): Promise<string> => {
  const partnerRepo = getRepository(Partner);
  const partner = await partnerRepo.createQueryBuilder('partner').getOne();
  if (!partner || !partner.id) throw Error('No partner');
  return partner.id;
};
