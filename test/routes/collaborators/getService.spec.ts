import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';
import Service from '../../../src/models/Service.model';

const app = createServer();

describe('GET /api/collaborators/services/<serviceId> - Ruta para mostrar un servicio en especifico', () => {
  let token: string;
  let serviceId: string;
  before(async () => {
    await dbConnection();
    token = await getToken();
    serviceId = await getServiceId();
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Muestra el registro completo de un servicio', (done) => {
    request(app)
      .get(`/api/collaborators/services/${serviceId}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  it('404 - El servicio no fue encontrado', (done) => {
    request(app)
      .get(`/api/collaborators/services/thisisatest`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Servicio no encontrado');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get(`/api/collaborators/services/${serviceId}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
const getServiceId = async (): Promise<string> => {
  const serviceRepo = getRepository(Service);
  const service = await serviceRepo.createQueryBuilder('service').getOne();
  if (!service || !service.id) throw Error('No service');
  return service.id;
};
