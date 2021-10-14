import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('PUT /api/collaborators/partner/<partnerId>/billing - Actualiza la informacion de facturacion del socio', () => {
  let token: string;
  let partnerId: string;
  const loginData = {
    email: 'seguridadhcsdevs@gmail.com',
    password: 'thisIsAtest98!'
  };
  before((done) => {
    dbConnection().then(() => {
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
  after((done) => {
    getConnection().close();
    done();
  });
  it('400 - Error en el input al crear la informacion de facturacion', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerId}/billing`)
      .set('token', token)
      .send({
        method: 'Deposito bancario',
        chequeno: '11223344556677',
        accounter: '776665554443322211'
      })
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Error en el input');
        done();
      });
  });
  it('200 - Informacion de facturacion creada', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerId}/billing`)
      .set('token', token)
      .send({
        method: 'Deposito bancario',
        chequeno: '11223344556677',
        account: '776665554443322211'
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
  it('200 - Informacion de facturacion actualizada', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerId}/billing`)
      .set('token', token)
      .send({
        method: 'Deposito bancario',
        chequeno: '11223344556677',
        account: '776665554443322211'
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
  it('400 - Error en el input al actualizar la informacion de facturacion', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerId}/billing`)
      .set('token', token)
      .send({
        method: 'Deposito bancario',
        chequeno: '11223344556677',
        accounter: '776665554443322211'
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
      .put(`/api/collaborators/partners/thisisatest/billing`)
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Socio no encontrado');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .put(`/api/collaborators/partners/${partnerId}/billing`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
