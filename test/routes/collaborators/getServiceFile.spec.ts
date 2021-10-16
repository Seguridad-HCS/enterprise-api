import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';
import Service from '../../../src/models/Service.model';

const app = createServer();

describe('GET /api/collaborators/services/<serviceId>/<fileName> - Ruta para descargar un archivo de servicio', () => {
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
  it('200 - Obtiene el archivo del servicio', (done) => {
    request(app)
      .get(`/api/collaborators/services/${serviceId}/constitutiveAct`)
      .set('token', token)
      .expect('Content-type', 'application/pdf')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
  it('404 - El servicio no fue encontrado', (done) => {
    request(app)
      .get(`/api/collaborators/services/thisIsATest/constitutiveAct`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Servicio no encontrado');
        done();
      });
  });
  it('404 - Nombre del archivo inexistente', (done) => {
    request(app)
      .get(`/api/collaborators/services/${serviceId}/thisIsATest`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Nombre del archivo inexistente');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get(`/api/collaborators/services/${serviceId}/constitutiveAct`)
      .expect('Content-type', 'application/json; charset=utf-8')
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
  const service = await serviceRepo
    .createQueryBuilder('service')
    .where('service.constitutiveAct IS NOT NULL')
    .getOne();
  if (!service || !service.id) throw Error('No service');
  return service.id;
};
