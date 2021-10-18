import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import genFakeRecoverToken from '../../helpers/genFakeRecoverToken.helper';

const app = createServer();

describe('PUT /api/collaborators/auth/recover - Restablece la contraseña del colaborador', () => {
  let token1: string;
  let token2: string;
  before(async () => {
    await dbConnection();
    token1 = await genFakeRecoverToken();
    token2 = await genFakeRecoverToken(true);
  });
  after(async () => await getConnection().close());
  it('200 - Se ha restablecido la contraseña del colaborador', (done) => {
    request(app)
      .put('/api/collaborators/auth/recover')
      .set('token', token1)
      .send({
        password: 'Holamundo98!'
      })
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Contraseña actualizada');
        done();
      });
  });
  it('400 - La contraseña no cumple con los requisitos', (done) => {
    request(app)
      .put('/api/collaborators/auth/recover')
      .set('token', token2)
      .send({
        password: 'holiwidijoelkiwi'
      })
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'La contraseña debe contener al menos una mayuscula, una minuscula, un caracter especial (@$!%*?&) y una longitud entre 8 y 30 caracteres'
        );
        done();
      });
  });
  it('405 - El token ya ha sido utilizado', (done) => {
    request(app)
      .put('/api/collaborators/auth/recover')
      .set('token', token1)
      .send({
        password: 'Holamundo98!'
      })
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .put('/api/collaborators/auth/recover')
      .send({
        password: 'Holamundo98!'
      })
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
