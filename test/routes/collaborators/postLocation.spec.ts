import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';

const app = createServer();

describe('POST /api/collaborators/locations - Ruta de creacion de locaciones', () => {
  let token: string;
  before(async () => {
    await dbConnection();
    token = await getToken();
  });
  after(async () => {
    await getConnection().close();
  });
  it('201 - Ubicacion sin servicio creada', (done) => {
    request(app)
      .post('/api/collaborators/locations')
      .set('token', token)
      .send({
        name: 'Oficina de pruebas2',
        address: {
          street: 'Cipres',
          outNumber: 'Mz.12 Lt.10',
          intNumber: 'N/A',
          neighborhood: 'Narvarte',
          zip: '09950',
          municipality: 'Iztapalapa',
          state: 'Ciudad de Mexico'
        }
      })
      .expect('Content-type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Locacion creada');
        expect(res.body.location).to.be.not.undefined;
        done();
      });
  });
  it('400 - Error en el input', (done) => {
    request(app)
      .post('/api/collaborators/locations')
      .set('token', token)
      .send({
        name: 'Oficina de pruebas2',
        address: {
          streeto: 'Cipres',
          outNumber: 'Mz.12 Lt.10',
          intNumber: 'N/A',
          neighborhood: 'Narvarte',
          zip: '09950',
          municipality: 'Iztapalapa',
          state: 'Ciudad de Mexico'
        }
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
      .post(`/api/collaborators/locations`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
