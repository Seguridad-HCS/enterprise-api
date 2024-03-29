import request from 'supertest';
import { getConnection } from 'typeorm';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';
import { expect } from 'chai';

const app = createServer();

describe('POST /api/collaborators/auth/login - Ruta de autenticacion de colaboradores', () => {
  before(async () => await dbConnection());
  after(async () => await getConnection().close());
  it('200 - Credenciales correctas', (done) => {
    request(app)
      .post('/api/collaborators/auth/login')
      .send({
        email: 'seguridadhcsdevs@gmail.com',
        password: 'thisIsAtest98!'
      })
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers.token).to.exist;
        expect(res.body.name).exist;
        expect(res.body.role).exist;
        done();
      });
  });
  it('404 - Email incorrecto', (done) => {
    request(app)
      .post('/api/collaborators/auth/login')
      .send({
        email: 'seguridadhcsdevs@gmail.como',
        password: 'thisIsAtest98!'
      })
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers.token).to.undefined;
        expect(res.body.server).to.equal('Usuario no encontrado');
        done();
      });
  });
  it('404 - Password incorrecto', (done) => {
    request(app)
      .post('/api/collaborators/auth/login')
      .send({
        email: 'seguridadhcsdevs@gmail.com',
        password: 'testtest'
      })
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers.token).to.undefined;
        expect(res.body.server).to.equal('Usuario no encontrado');
        done();
      });
  });
  it('404 - Inyeccion SQL', (done) => {
    request(app)
      .post('/api/collaborators/auth/login')
      .send({
        email: ' or "1"="1"',
        password: ' or "1"="1"'
      })
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers.token).to.undefined;
        expect(res.body.server).to.equal('Usuario no encontrado');
        done();
      });
  });
});
