import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';

import Partner from '../../../src/models/Partner.model';

const app = createServer();

describe('POST /api/collaborators/partner/billing/process - Crea un proceso de facturacion', () => {
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
  it('201 - Proceso de facturacion creado', (done) => {
    request(app)
      .post(`/api/collaborators/partners/${partnerIds[1]}/billing/process`)
      .set('token', token)
      .send({
        name: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
      })
      .expect('Content-type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Proceso de facturacion creado');
        expect(res.body.process.id).to.be.a('string');
        expect(res.body.process.name).to.be.a('string');
        expect(res.body.process.description).to.be.a('string');
        done();
      });
  });
  it('400 - Error en el input', (done) => {
    request(app)
      .post(`/api/collaborators/partners/${partnerIds[1]}/billing/process`)
      .set('token', token)
      .send({
        names: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
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
      .post(`/api/collaborators/partners/thisisatest/billing/process`)
      .set('token', token)
      .send({
        name: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
      })
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Socio no encontrado');
        done();
      });
  });
  it('405 - Se ha alcanzado el limite de procesos de facturacion PENDIENTE DE TESTEO', (done) => {
    request(app)
      .post(`/api/collaborators/partners/${partnerIds[1]}/billing/process`)
      .set('token', token)
      .send({
        name: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
      })
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Error en el input');
        done();
      });
  });
  it('405 - La informacion de facturacion general no ha sido actualizada', (done) => {
    request(app)
      .post(`/api/collaborators/partners/${partnerIds[0]}/billing/process`)
      .set('token', token)
      .send({
        name: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
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
      .post(`/api/collaborators/partners/${partnerIds[1]}/billing/process`)
      .send({
        name: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
      })
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
