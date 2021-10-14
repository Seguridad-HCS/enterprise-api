import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';
import Partner from '../../../src/models/Partner.model';

const app = createServer();

describe('PUT /api/collaborators/partner/<partnerId>/billing/address - Actualiza la direccion de facturacion del socio', () => {
  let token: string;
  let partnerId: string;
  let partnerWithoutBilling: string | undefined;
  const loginData = {
    email: 'seguridadhcsdevs@gmail.com',
    password: 'thisIsAtest98!'
  };
  before((done) => {
    dbConnection().then(() => {
      getRepository(Partner)
        .createQueryBuilder('partner')
        .where('partner.billing IS NULL')
        .getOne()
        .then((query) => {
          partnerWithoutBilling = query ? query.id : 'thisIsatest';
          request(app)
            .post('/api/collaborators/auth/login')
            .send(loginData)
            .end((err, res) => {
              if (err) return done(err);
              token = res.headers.token;
              // Get some partnerId
              request(app)
                .get('/api/collaborators/partners')
                .set('token', token)
                .expect('Content-type', /json/)
                .expect(200)
                .end((err, res) => {
                  if (err) return done(err);
                  partnerId = res.body.partners[0].id;
                  done();
                });
            });
        });
    });
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('400 - Error en el input al crear la direccion de facturacion', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerId}/billing/address`)
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
      .put(`/api/collaborators/partners/${partnerId}/billing/address`)
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
          'Informacion de facturacion actualizada'
        );
        done();
      });
  });
  it('200 - Direccion de facturacion actualizada', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerId}/billing/address`)
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
          'Informacion de facturacion actualizada'
        );
        done();
      });
  });
  it('400 - Error en el input al actualizar la direccion de facturacion', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerId}/billing/address`)
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
      .put(
        `/api/collaborators/partners/${partnerWithoutBilling}/billing/address`
      )
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
      .put(`/api/collaborators/partners/${partnerId}/billing/address`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
