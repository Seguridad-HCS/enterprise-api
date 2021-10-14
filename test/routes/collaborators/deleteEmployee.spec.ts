import { expect } from 'chai';
import request from 'supertest';
import dotenv from 'dotenv';
import { getConnection } from 'typeorm';

import dbConnection from '../../../src/dbConnection';
import createServer from '../../../src/server';

const app = createServer();
dotenv.config();

describe('DELETE /api/collaborators/employees/<employeeId> - Elimina un colaborador', () => {
  let token: string;
  let employeeId: string;
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
          // Get some employeeId
          request(app)
            .get('/api/collaborators/employees')
            .set('token', token)
            .end((err, res) => {
              if (err) return done(err);
              employeeId = res.body.employees[0].id;
              done();
            });
        });
    });
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('200 - Elimina a un colaborador', (done) => {
    request(app)
      .delete(`/api/collaborators/employees/${employeeId}`)
      .set('token', token)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Colaborador eliminado');
        done();
      });
  });
  it('404 - Colaborador no encontrado', (done) => {
    request(app)
      .delete(`/api/collaborators/employees/1`)
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Colaborador no encontrado');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .delete(`/api/collaborators/employees/${employeeId}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
