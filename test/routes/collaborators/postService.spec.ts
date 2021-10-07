import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('POST /collaborators/service - Ruta de creacion de servicio', () => {
  let token: string;
  let partnerWithServices: string;
  let partnerWithoutServices: string;
  const loginData = {
    email: 'seguridadhcsdevs@gmail.com',
    password: 'thisIsAtest98!'
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
              res.body.partners.forEach((partner: any) => {
                if (partner.services.length > 0)
                  partnerWithServices = partner.id;
                else partnerWithoutServices = partner.id;
              });
              done();
            });
        });
    });
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('201 - Servicio creado exitosamente', (done) => {
    request(app)
      .post('/collaborators/services')
      .set('token', token)
      .send({
        partner: partnerWithoutServices
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
      .post('/collaborators/services')
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
      .post('/collaborators/services')
      .set('token', token)
      .send({
        partner: partnerWithServices
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
      .post(`/collaborators/services`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
