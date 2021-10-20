import { expect } from 'chai';
import request from 'supertest';
import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { getConnection, getRepository } from 'typeorm';

import dbConnection from '../../../src/dbConnection';
import createServer from '../../../src/server';

import getToken from '../../helpers/getToken.helper';

import Employee from '../../../src/models/Employee.model';

const app = createServer();
dotenv.config();

describe('DELETE /api/collaborators/employees/<employeeId> - Elimina un colaborador', () => {
  let token: string;
  let employeeId: string;
  let loggedUserId: string;
  before(async () => {
    await dbConnection();
    token = await getToken();
    ({ data: loggedUserId } = jwt.verify(
      token as string,
      <string>process.env.SERVER_TOKEN
    ) as jwt.JwtPayload);
    employeeId = await getEmployeeId();
  });
  after(async () => {
    await getConnection().close();
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
  it('405 - Un socio no puede eliminarse a si mismo', (done) => {
    request(app)
      .delete(`/api/collaborators/employees/${loggedUserId}`)
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'Un socio no puede eliminarse a si mismo'
        );
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .delete(`/api/collaborators/employees/${loggedUserId}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});

const getEmployeeId = async (): Promise<string> => {
  const emplRepo = getRepository(Employee);
  const employee = await emplRepo
    .createQueryBuilder('employee')
    .where('employee.email != :email', { email: 'seguridadhcsdevs@gmail.com' })
    .getOne();
  if (!employee || !employee.id) throw Error('No employee');
  return employee.id;
};
