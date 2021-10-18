import request from 'supertest';
import path from 'path';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';
import Service from '../../../src/models/Service.model';

const app = createServer();

describe('POST /api/collaborators/services/file - Ruta de creacion de archivo de servicio', () => {
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
  it('201 - Acta constitutiva actualizada - Etapa de registro', (done) => {
    request(app)
      .post('/api/collaborators/services/files')
      .set('token', token)
      .field('file', 'constitutiveAct')
      .field('service', serviceId)
      .attach('file', path.resolve(__dirname, '../../sampleFiles/test.pdf'))
      .expect('Content-type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Archivo actualizado');
        done();
      });
  });
  it('201 - Poder notarial actualizado - Etapa de registro', (done) => {
    request(app)
      .post('/api/collaborators/services/files')
      .set('token', token)
      .field('file', 'powerOfAttorney')
      .field('service', serviceId)
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
      .post('/api/collaborators/services/files')
      .set('token', token)
      .field('file', 'addressProof')
      .field('service', serviceId)
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
      .post('/api/collaborators/services/files')
      .set('token', token)
      .field('file', 'ine')
      .field('service', serviceId)
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
      .post('/api/collaborators/services/files')
      .set('token', token)
      .send({
        partnerId: 'thisisatest'
      })
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
      .post('/api/collaborators/services/files')
      .set('token', token)
      .field('file', 'thisisatest')
      .field('service', serviceId)
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
  it('405 - Archivo bloqueado PENDIENTE DE TESTEAR', (done) => {
    request(app)
      .post('/api/collaborators/services/files')
      .set('token', token)
      .send({
        partner: serviceId
      })
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
      .post(`/api/collaborators/services/files`)
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
