import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('GET /collaborators/employees/positions - Ruta para mostrar las posiciones registradas', () => {
  let token: string;
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
          done();
        });
    });
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('200 - Muestra a las posiciones registradas en el sistema', (done) => {
    request(app)
      .get('/collaborators/employees/positions')
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Listado de posiciones');
        expect(res.body.positions).to.be.an('array');
        res.body.positions.forEach((location: any) => {
          expect(location.id).to.be.a('string');
          expect(location.name).to.be.a('string');
          expect(location.department).to.be.a('string');
        });
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get('/collaborators/employees/positions')
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
