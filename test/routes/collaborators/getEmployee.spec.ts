import { expect } from 'chai';
import { getConnection, getRepository } from 'typeorm';
import request from 'supertest';
import dotenv from 'dotenv';

import dbConnection from '../../../src/dbConnection';
import createServer from '../../../src/server';

import getToken from '../../helpers/getToken.helper';

import Employee from '../../../src/models/Employee.model';

const app = createServer();
dotenv.config();

describe('GET /api/collaborators/employees/{employeeId} - Muestra un colaborador especifico', () => {
  let token: string;
  let employeeId: string;
  before(async () => {
    await dbConnection();
    token = await getToken();
    employeeId = await getEmployeeId();
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Muestra el registro completo de un colaborador', (done) => {
    request(app)
      .get(`/api/collaborators/employees/${employeeId}`)
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.employee.id).to.be.a('string');
        expect(res.body.employee.name).to.be.a('string');
        expect(res.body.employee.surname).to.be.a('string');
        expect(res.body.employee.secondSurname).to.be.a('string');
        expect(res.body.employee.sex).to.be.a('boolean');
        expect(res.body.employee.birthDate).to.be.a('string');
        expect(res.body.employee.createdAt).to.be.a('string');
        expect(res.body.employee.email).to.be.a('string');
        expect(res.body.employee.password).to.be.undefined;
        expect(res.body.employee.nss).to.be.a('string');
        expect(res.body.employee.bloodtype).to.be.a('string');
        expect(res.body.employee.rfc).to.be.a('string');
        expect(res.body.employee.baseWage).to.be.a('number');
        // TODO Pendientes para el flujo de registro de empleado
        // expect(res.body.employee.profile.id).to.be.a('number');
        // expect(res.body.employee.profile.total).to.be.a('number');
        // expect(res.body.employee.profile.minAge).to.be.a('number');
        // expect(res.body.employee.profile.maxAge).to.be.a('number');
        // expect(res.body.employee.profile.sex).to.be.a('number');
        done();
      });
  });
  it('404 - El empleado no fue encontrado', (done) => {
    request(app)
      .get(`/api/collaborators/employees/thisisatest`)
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
      .get(`/api/collaborators/employees/${employeeId}`)
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
  const employeeRepo = getRepository(Employee);
  const employee = await employeeRepo.createQueryBuilder('employee').getOne();
  if (!employee || !employee.id) throw Error('No employee');
  return employee.id;
};
