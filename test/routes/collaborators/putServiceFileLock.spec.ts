import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';
import getLockServiceFile from '../../helpers/getServiceFileLock.helper';
import getNoneServiceFile from '../../helpers/getServiceFileNone.helper';

const app = createServer();

describe('PUT /api/collaborators/services/<serviceId>/file/lock - Ruta de bloqueo/desbloqueo de archivo de servicio', () => {
  let token: string;
  let lockFile: string[];
  let noneFile: string[];
  before(async () => {
    await dbConnection();
    token = await getToken();
    // [0: serviceId, 1: fileName]
    lockFile = await getLockServiceFile();
    // [0: serviceId, 1: fileName]
    noneFile = await getNoneServiceFile();
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Archivo desbloqueado', (done) => {
    request(app)
      .put(`/api/collaborators/services/${lockFile[0]}/file/lock`)
      .set('token', token)
      .send({
        fileName: lockFile[1],
        lock: true
      })
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Bloqueo actualizado');
        done();
      });
  });
  it('200 - Archivo bloqueado', (done) => {
    request(app)
      .put(`/api/collaborators/services/${lockFile[0]}/file/lock`)
      .set('token', token)
      .send({
        fileName: lockFile[1],
        lock: true
      })
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Bloqueo actualizado');
        done();
      });
  });
  it('404 - El servicio no fue encontrado', (done) => {
    // TODO especificar el objeto que se recibe
    request(app)
      .put(`/api/collaborators/services/thisisatest/file/lock`)
      .set('token', token)
      .send({
        fileName: 'constitutiveAct',
        lock: true
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Servicio no encontrado');
        done();
      });
  });
  it('404 - El nombre del archivo no existe', (done) => {
    request(app)
      .put(`/api/collaborators/services/${lockFile[0]}/file/lock`)
      .set('token', token)
      .send({
        fileName: 'constitutiveActo',
        lock: true
      })
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
  it('404 - El archivo no ha sido registrado', (done) => {
    request(app)
      .put(`/api/collaborators/services/${noneFile[0]}/file/lock`)
      .set('token', token)
      .send({
        fileName: noneFile[1],
        lock: true
      })
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('El archivo no ha sido registrado');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .put(`/api/collaborators/services/${lockFile[0]}/file/lock`)
      .send({
        fileName: lockFile[1],
        lock: true
      })
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
