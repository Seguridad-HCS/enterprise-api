import { expect } from 'chai';
import request from 'supertest';
import dotenv from 'dotenv';
import { getConnection } from 'typeorm';

import dbConnection from '../../../src/dbConnection';
import createServer from '../../../src/server';

import getToken from '../../helpers/getToken.helper';

const app = createServer();
dotenv.config();

describe('GET /api/collaborators/employees - Muestra a los colaboradores', () => {
  let token: string;
  before(async () => {
    await dbConnection();
    token = await getToken();
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Muestra a los colaboradores', (done) => {
    request(app)
      .get(`/api/collaborators/employees`)
      .set('token', token)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Lista de colaboradores');
        res.body.employees.forEach((employee: any) => {
          expect(employee.id).to.be.a('string');
          expect(employee.name).to.be.a('string');
          expect(employee.surname).to.be.a('string');
          expect(employee.secondSurname).to.be.a('string');
          expect(employee.position.name).to.be.not.undefined;
          expect(employee.position.description).to.be.not.undefined;
          expect(employee.position.department).to.be.not.undefined;
          expect(employee.location.id).to.be.not.undefined;
          expect(employee.location.name).to.be.not.undefined;
          expect(employee.location.state).to.be.not.undefined;
        });
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get(`/api/collaborators/employees`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
