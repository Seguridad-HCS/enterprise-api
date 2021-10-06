import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('GET /collaborators/services/<serviceId>/<fileName> - Ruta para descargar un archivo de servicio', () => {
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
  it('200 - Obtiene el archivo del servicio', (done) => {
    request(app)
      .get(`/collaborators/services/${serviceId}/constitutiveAct`)
      .set('token', token)
      .expect('Content-type', 'application/pdf')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
  it('404 - El servicio no fue encontrado', (done) => {
    request(app)
      .get(`/collaborators/services/thisIsATest/constitutiveAct`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Servicio no encontrado');
        done();
      });
  });
  it('404 - Nombre del archivo inexistente', (done) => {
    request(app)
      .get(`/collaborators/services/${serviceId}/thisIsATest`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Nombre del archivo inexistente');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get(`/collaborators/services/${serviceId}/constitutiveAct`)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
