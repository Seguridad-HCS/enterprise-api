import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';
import Partner from '../../../src/models/Partner.model';

const app = createServer();

describe('PUT /api/collaborators/partner/<partnerId>/billing/address - Actualiza la direccion de facturacion del socio', () => {
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
  it('400 - Error en el input al crear la direccion de facturacion', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerIds[1]}/billing/address`)
      .set('token', token)
      .send({
        street: 'Vorago',
        outNumber: 'Mz.21',
        intNumber: 'Lt.18',
        neighborhood: 'Aranceles',
        zip: '49956',
        municipality: 'Magdalena Contreras',
        estado: 'CDMX'
      })
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Error en el input');
        done();
      });
  });
  it('200 - Direccion de facturacion creada', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerIds[1]}/billing/address`)
      .set('token', token)
      .send({
        street: 'Vorago',
        outNumber: 'Mz.21',
        intNumber: 'Lt.18',
        neighborhood: 'Aranceles',
        zip: '49956',
        municipality: 'Magdalena Contreras',
        state: 'CDMX'
      })
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'Direccion de facturacion actualizada'
        );
        done();
      });
  });
  it('200 - Direccion de facturacion actualizada', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerIds[1]}/billing/address`)
      .set('token', token)
      .send({
        street: 'Vorago',
        outNumber: 'Mz.21',
        intNumber: 'Lt.18',
        neighborhood: 'Aranceles',
        zip: '49956',
        municipality: 'Magdalena Contreras',
        state: 'CDMX'
      })
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'Direccion de facturacion actualizada'
        );
        done();
      });
  });
  it('400 - Error en el input al actualizar la direccion de facturacion', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerIds[1]}/billing/address`)
      .set('token', token)
      .send({
        street: 'Vorago',
        outNumber: 'Mz.21',
        intNumber: 'Lt.18',
        neighborhood: 'Aranceles',
        zip: '49956',
        municipality: 'Magdalena Contreras',
        estado: 'CDMX'
      })
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Error en el input');
        done();
      });
  });
  it('404 - Socio no encontrado', (done) => {
    request(app)
      .put(`/api/collaborators/partners/thisisatest/billing/address`)
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Socio no encontrado');
        done();
      });
  });
  it('405 - La informacion de facturacion general no ha sido actualizada', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerIds[0]}/billing/address`)
      .set('token', token)
      .send({
        street: 'Vorago',
        outNumber: 'Mz.21',
        intNumber: 'Lt.18',
        neighborhood: 'Aranceles',
        zip: '49956',
        municipality: 'Magdalena Contreras',
        state: 'CDMX'
      })
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'La informacion de facturacion general no ha sido actualizada'
        );
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerIds[1]}/billing/address`)
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
    .leftJoinAndSelect('partner.billing', 'billing')
    .getMany();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const aux1 = partners.find((prtn: Partner) => prtn.billing);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const aux2 = partners.find((prtn: Partner) => !prtn.billing);
  if (!aux1 || !aux1.id) throw Error('No partner with billing');
  if (!aux2 || !aux2.id) throw Error('No partner without billing');
  const withService = aux2.id;
  const withoutService = aux1.id;
  return [withService, withoutService];
};
