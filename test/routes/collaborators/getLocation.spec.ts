import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('GET /api/collaborators/locations/<locationId> - Muestra una locacion especifica', () => {
  let token: string;
  let locationId: number;
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
          request(app)
            .get('/api/collaborators/locations')
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              locationId = res.body.locations[0].id;
              done();
            });
        });
    });
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('200 - Muestra el registro completo de una locacion', (done) => {
    request(app)
      .get(`/api/collaborators/locations/${locationId}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        // TODO Describir el tipo de objeto que se recibe
        if (err) return done(err);
        expect(res.body.location.id).to.be.a('string');
        expect(res.body.location.name).to.be.a('string');
        expect(res.body.location.status).to.be.a('boolean');
        expect(res.body.location.address).to.be.a('object');
        expect(res.body.location.profiles).to.be.an('array');
        done();
      });
  });
  it('404 - La locacion no fue encontrada', (done) => {
    request(app)
      .get(`/api/collaborators/locations/thisIsaTest`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Locacion no encontrada');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get(`/api/collaborators/locations/${locationId}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
