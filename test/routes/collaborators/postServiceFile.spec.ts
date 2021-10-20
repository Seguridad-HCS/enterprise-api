import request from 'supertest';
import path from 'path';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';
import Service from '../../../src/models/Service.model';
import getServiceFileLock from '../../helpers/getServiceFileLock.helper';

const app = createServer();

describe('POST /api/collaborators/services/<serviceId>/file - Ruta de creacion de archivo de servicio', () => {
  let token: string;
  let serviceId: string;
  let lockFile: string[];
  before(async () => {
    await dbConnection();
    token = await getToken();
    serviceId = await getServiceId();
    // [0: serviceId, 1: fileName]
    lockFile = await getServiceFileLock();
  });
  after(async () => {
    await getConnection().close();
  });
  it('201 - Poder notarial actualizado - Etapa de registro', (done) => {
    request(app)
      .post(`/api/collaborators/services/${serviceId}/file`)
      .set('token', token)
      .field('fileName', 'powerOfAttorney')
      .attach('file', path.resolve(__dirname, '../../sampleFiles/test.pdf'))
      .expect('Content-type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Archivo actualizado');
        done();
      });
  });
  it('201 - Comprobante de domicilio creado - Etapa de registro', (done) => {
    request(app)
      .post(`/api/collaborators/services/${serviceId}/file`)
      .set('token', token)
      .field('fileName', 'addressProof')
      .attach('file', path.resolve(__dirname, '../../sampleFiles/test.pdf'))
      .expect('Content-type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Archivo creado');
        done();
      });
  });
  it('201 - Ine creada - Etapa de registro', (done) => {
    request(app)
      .post(`/api/collaborators/services/${serviceId}/file`)
      .set('token', token)
      .field('fileName', 'ine')
      .attach('file', path.resolve(__dirname, '../../sampleFiles/test.pdf'))
      .expect('Content-type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Archivo creado');
        done();
      });
  });
  it('404 - El servicio no fue encontrado', (done) => {
    // TODO especificar el objeto que se recibe
    request(app)
      .post(`/api/collaborators/services/thisisatest/file`)
      .set('token', token)
      .field('fileName', 'ine')
      .attach('file', path.resolve(__dirname, '../../sampleFiles/test.pdf'))
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Servicio no encontrado');
        done();
      });
  });
  it('405 - El nombre del archivo no coincide con la etapa del servicio', (done) => {
    request(app)
      .post(`/api/collaborators/services/${serviceId}/file`)
      .set('token', token)
      .field('fileName', 'thisisatest')
      .attach('file', path.resolve(__dirname, '../../sampleFiles/test.pdf'))
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'El nombre del archivo no coincide con la etapa del servicio'
        );
        done();
      });
  });
  it('405 - Acta constitutiva - Archivo bloqueado', (done) => {
    request(app)
      .post(`/api/collaborators/services/${lockFile[0]}/file`)
      .set('token', token)
      .field('fileName', lockFile[1])
      .attach('file', path.resolve(__dirname, '../../sampleFiles/test.pdf'))
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Archivo bloqueado');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .post(`/api/collaborators/services/${serviceId}/file`)
      .field('fileName', 'ine')
      .attach('file', path.resolve(__dirname, '../../sampleFiles/test.pdf'))
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
