import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('PUT /api/collaborators/auth/recover - Restablece la contraseña del colaborador', () => {
  before((done) => {
    dbConnection().then(() => done());
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('200 - Se ha restablecido la contraseña del colaborador TESTEO PENDIENTE', (done) => {
    request(app)
      .put('/api/collaborators/auth/recover')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        //expect(res.body.server).to.equal('Contraseña actualizada');
        done();
      });
  });
});
