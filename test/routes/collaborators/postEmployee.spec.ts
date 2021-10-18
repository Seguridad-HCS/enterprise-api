import { expect } from 'chai';
import request from 'supertest';
import dotenv from 'dotenv';
import { getConnection, getRepository } from 'typeorm';

import dbConnection from '../../../src/dbConnection';
import createServer from '../../../src/server';

import getToken from '../../helpers/getToken.helper';

import LocationProfile from '../../../src/models/LocationProfile.model';

const app = createServer();
dotenv.config();

describe('POST /api/collaborators/employees - Crea un empleado', () => {
  let token: string;
  let profileId: string;
  before(async () => {
    await dbConnection();
    token = await getToken();
    profileId = await getProfileId();
  });
  after(async () => {
    await getConnection().close();
  });
  it('201 - Socio registrado', (done) => {
    // TODO especificar el objeto que se recibe
    request(app)
      .post('/api/collaborators/employees/')
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
        done();
      });
  });
  it('400 - Error en el input', (done) => {
    request(app)
      .post('/api/collaborators/employees/')
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
      .post('/api/collaborators/employees/')
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
      .post('/api/collaborators/employees')
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
const getProfileId = async (): Promise<string> => {
  const profileRepo = getRepository(LocationProfile);
  const profile = await profileRepo.createQueryBuilder('partner').getOne();
  if (!profile || !profile.id) throw Error('No profiles');
  return profile.id;
};
