import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('GET /collaborators/services/<serviceId> - Ruta para mostrar un servicio en especifico', () => {
  let token: string;
  let serviceId: string;
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
          // Get some partnerId
          request(app)
            .get('/collaborators/partners')
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              const partnerWithService = res.body.partners.find(
                (partner: any) => partner.services.length > 0
              );
              serviceId = partnerWithService.services[0].id;
              done();
            });
        });
    });
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('200 - Muestra el registro completo de un servicio', (done) => {
    request(app)
      .get(`/collaborators/services/${serviceId}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  it('404 - El servicio no fue encontrado', (done) => {
    request(app)
      .get(`/collaborators/services/thisisatest`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Servicio no encontrado');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get(`/collaborators/services/${serviceId}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
