import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('DELETE /collaborators/partners/contacts - Elimina el contacto de un socio', () => {
  let token: string;
  let contactId: number;
  const loginData = {
    email: 'johndoe@gmail.com',
    password: 'test'
  };
  before((done) => {
    dbConnection().then(() => {
      request(app)
        .post('/collaborators/auth/login')
        .send(loginData)
        .end((err, res) => {
          if (err) return done(err);
          token = res.headers.token;
          // Get some random partnerId
          request(app)
            .get('/collaborators/partners')
            .set('token', token)
            .end((err, res) => {
              if (err) return done(err);
              const partnerId = res.body.partners![0].id;
              request(app)
                .get(`/collaborators/partners/${partnerId}`)
                .set('token', token)
                .end((err, res) => {
                  if (err) return done(err);
                  contactId = res.body.partner.contacts![0].id;
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
  it('200 - Contacto eliminado', (done) => {
    request(app)
      .delete(`/collaborators/partners/contacts/${contactId}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Contacto eliminado');
        done();
      });
  });
  it('404 - Contacto no encontrado', (done) => {
    request(app)
      .delete(`/collaborators/partners/contacts/1`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Contacto no encontrado');
        done();
      });
  });
  it('405 - Debe existir al menos un contacto si el socio tiene servicios activos 405 TESTEO PENDIENTE', (done) => {
    request(app)
      .delete(`/collaborators/partners/contacts/thiisatest`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Contacto no encontrado');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .delete(`/collaborators/partners/contacts/${contactId}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
