import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('POST /api/collaborators/auth/reboot - Solicita un token de recuperacion de correo', () => {
  before((done) => {
    dbConnection().then(() => done());
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('200 - Correo de recuperacion enviado al colaborador', (done) => {
    request(app)
      .post('/api/collaborators/auth/reboot')
      .send({
        email: 'seguridadhcsdevs@gmail.com'
      })
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'Correo de recuperacion enviado al colaborador'
        );
        done();
      });
  });
});
