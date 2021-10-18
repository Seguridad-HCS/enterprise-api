import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';

const app = createServer();

describe('POST /api/collaborators/partners - Registra a un colaborador en el sistema', () => {
  let token: string;
  before(async () => {
    await dbConnection();
    token = await getToken();
  });
  after(async () => {
    await getConnection().close();
  });
  it('201 - Socio registrado', (done) => {
    request(app)
      .post('/api/collaborators/partners')
      .set('token', token)
      .send({
        name: 'Oxxo',
        legalName: 'Abarrotes corporativos Oxxo S.a. de C.V.',
        rfc: 'MAVO980605',
        representative: 'Oscar Martinez Vazquez',
        email: 'oscarmartinez1998@hotmail.es',
        phoneNumber: '+525536593166'
      })
      .expect('Content-type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Socio creado');
        done();
      });
  });
  it('400 - Error en el input', (done) => {
    request(app)
      .post('/api/collaborators/partners')
      .set('token', token)
      .send({
        nane: 'Oxxo',
        legalName: 'Abarrotes corporativos Oxxo S.a. de C.V.',
        rfc: 'MAVO980605',
        representative: 'Oscar Martinez Vazquez',
        email: 'oscarmartinez1998@hotmail.es',
        phoneNumber: '+525536593166'
      })
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Error en el input');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .post(`/api/collaborators/partners`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
