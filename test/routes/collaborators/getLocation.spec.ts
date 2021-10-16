import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import Location from '../../../src/models/Location.model';

import getToken from '../../helpers/getToken.helper';

const app = createServer();

describe('GET /api/collaborators/locations/<locationId> - Muestra una locacion especifica', () => {
  let token: string;
  let locationId: string;
  before(async () => {
    await dbConnection();
    token = await getToken();
    locationId = await getLocationId();
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Muestra el registro completo de una locacion', (done) => {
    request(app)
      .get(`/api/collaborators/locations/${locationId}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        // TODO Describir el tipo de objeto que se recibe
        if (err) return done(err);
        expect(res.body.location.id).to.be.a('string');
        expect(res.body.location.name).to.be.a('string');
        expect(res.body.location.status).to.be.a('boolean');
        expect(res.body.location.address).to.be.a('object');
        expect(res.body.location.profiles).to.be.an('array');
        done();
      });
  });
  it('404 - La locacion no fue encontrada', (done) => {
    request(app)
      .get(`/api/collaborators/locations/thisIsaTest`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Locacion no encontrada');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get(`/api/collaborators/locations/${locationId}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
const getLocationId = async (): Promise<string> => {
  const locationRepo = getRepository(Location);
  const location = await locationRepo.createQueryBuilder('location').getOne();
  if (!location || !location.id) throw Error('No location');
  return location.id;
};
