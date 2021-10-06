import { expect } from 'chai';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import dotenv from 'dotenv';
import { getConnection } from 'typeorm';

import dbConnection from '../../../src/dbConnection';
import createServer from '../../../src/server';

const app = createServer();
dotenv.config();

describe('POST /collaborators/employees - Ruta de creacion de empleados', () => {
  let token: string;
  let newEmployeeId: string;
  let profileId: string;
  const loginData = {
    email: 'johndoe@gmail.com',
    password: 'test'
  };
  before((done) => {
    dbConnection().then(() => {
      request(app)
        .post('/collaborators/auth/login')
        .send(loginData)
        .end((err, res) => {
          if (err) return done(err);
          token = res.headers.token;
          // Get some random position Id
          request(app)
            .get('/collaborators/locations')
            .set('token', token)
            .end((err, res) => {
              if (err) return done(err);
              const locationId = res.body.locations[0].id;
              request(app)
                .get(`/collaborators/locations/${locationId}`)
                .set('token', token)
                .end((err, res) => {
                  if (err) return done(err);
                  profileId = res.body.location.profiles[0].id;
                  done();
                });
            });
        });
    });
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('201 - Socio registrado', (done) => {
    // TODO especificar el objeto que se recibe
    request(app)
      .post('/collaborators/employees/')
      .set('token', token)
      .send({
        name: 'Test',
        surname: 'Example',
        secondSurname: 'Sample',
        email: 'test@example.com',
        nss: '8964296',
        bloodtype: 'A+',
        rfc: 'MAVO980605',
        birthDate: '05-06-1998',
        sex: true,
        baseWage: 4500000,
        locationProfile: profileId
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        newEmployeeId = res.body.employee.id;
        done();
      });
  });
  it('400 - Error en el input', (done) => {
    request(app)
      .post('/collaborators/employees/')
      .set('token', token)
      .send({
        name: 'Test',
        zurname: 'Example',
        secondSurname: 'Sample',
        email: 'test@example.com',
        nss: '8964296',
        bloodtype: 'A+',
        rfc: 'MAVO980605',
        birthDate: '05-06-1998',
        sex: true,
        baseWage: 4500000,
        locationProfile: profileId
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Error en el input');
        done();
      });
  });
  it('404 - Llaves foraneas validas o incorrectas', (done) => {
    // TODO especificar el objeto que se recibe
    request(app)
      .post('/collaborators/employees/')
      .set('token', token)
      .send({
        name: 'Test',
        surname: 'Example',
        secondSurname: 'Sample',
        email: 'test@example.com',
        nss: '8964296',
        bloodtype: 'A+',
        rfc: 'MAVO980605',
        birthDate: '05-06-1998',
        sex: true,
        baseWage: 4500000,
        locationProfile: 1
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'Llaves foraneas invalidas o incorrectas'
        );
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .post('/collaborators/employees')
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
