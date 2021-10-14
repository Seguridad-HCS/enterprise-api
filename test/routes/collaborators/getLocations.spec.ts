import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('GET /api/collaborators/locations?owner=<0,1> - Muestra las locaciones', () => {
  let token: string;
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
          done();
        });
    });
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('200 - Parametros: ninguno Listado de ubicaciones', (done) => {
    request(app)
      .get('/api/collaborators/locations')
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.eql('Lista de instalaciones');
        expect(res.body.locations).to.be.an('array');
        res.body.locations.forEach((location: any) => {
          expect(location.id).to.be.a('string');
          expect(location.name).to.be.a('string');
          expect(location.owner).to.be.a('string');
          expect(location.address.municipality).to.be.a('string');
          expect(location.address.state).to.be.a('string');
          expect(location.hr.total).to.be.a('number');
          expect(location.hr.hired).to.be.a('number');
        });
        done();
      });
  });
  it('200 - Parametros: owner=0 Listado de ubicaciones internas de HCS', (done) => {
    request(app)
      .get('/api/collaborators/locations?owner=0')
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Lista de instalaciones');
        expect(res.body.locations).to.be.an('array');
        res.body.locations.forEach((location: any) => {
          expect(location.owner).eql('Seguridad HCS');
        });
        done();
      });
  });
  it('200 - Parametros: owner=1 Listado de ubicaciones de socios', (done) => {
    request(app)
      .get('/api/collaborators/locations?owner=1')
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Lista de instalaciones');
        expect(res.body.locations).to.be.an('array');
        res.body.locations.forEach((location: any) => {
          expect(location.owner).eql('Servicio externo');
        });
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get(`/api/collaborators/locations`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
