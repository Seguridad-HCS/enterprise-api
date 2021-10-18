import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';
import getPrtnLessProcesses from '../../helpers/getPartnerLessBillingProcesses.helper';
import getPrtnFullProcesses from '../../helpers/getPartnerFullBillingProcesses.helper';
import getPrtnNoneBilling from '../../helpers/getPartnerNoneBilling.helper';

const app = createServer();

describe('POST /api/collaborators/partner/billing/process - Crea un proceso de facturacion', () => {
  let token: string;
  let prtnNoneId: string | undefined;
  let prtnLessId: string | undefined;
  let prtnFullId: string | undefined;
  before(async () => {
    await dbConnection();
    token = await getToken();
    ({ id: prtnNoneId } = await getPrtnNoneBilling());
    ({ id: prtnLessId } = await getPrtnLessProcesses());
    ({ id: prtnFullId } = await getPrtnFullProcesses());
  });
  after(async () => {
    await getConnection().close();
  });
  it('201 - Proceso de facturacion creado', (done) => {
    request(app)
      .post(`/api/collaborators/partners/${prtnLessId}/billing/process`)
      .set('token', token)
      .send({
        name: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
      })
      .expect('Content-type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Proceso de facturacion creado');
        expect(res.body.process.id).to.be.a('string');
        expect(res.body.process.name).to.be.a('string');
        expect(res.body.process.description).to.be.a('string');
        done();
      });
  });
  it('400 - Error en el input', (done) => {
    request(app)
      .post(`/api/collaborators/partners/${prtnLessId}/billing/process`)
      .set('token', token)
      .send({
        names: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
      })
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Error en el input');
        done();
      });
  });
  it('404 - Socio no encontrado', (done) => {
    request(app)
      .post(`/api/collaborators/partners/thisisatest/billing/process`)
      .set('token', token)
      .send({
        name: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
      })
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Socio no encontrado');
        done();
      });
  });
  it('405 - Se ha alcanzado el limite de procesos de facturacion', (done) => {
    request(app)
      .post(`/api/collaborators/partners/${prtnFullId}/billing/process`)
      .set('token', token)
      .send({
        name: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
      })
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'Se ha alcanzado el numero maximo (5) de procesos de registro'
        );
        done();
      });
  });
  it('405 - La informacion de facturacion general no ha sido actualizada', (done) => {
    request(app)
      .post(`/api/collaborators/partners/${prtnNoneId}/billing/process`)
      .set('token', token)
      .send({
        name: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
      })
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'Se ha alcanzado el numero maximo (5) de procesos de registro'
        );
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .post(`/api/collaborators/partners/${prtnLessId}/billing/process`)
      .send({
        name: 'Entrega en fisico de la factura',
        description:
          'Entregar en fisico la factura en la direccion de facturacion'
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
