import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';

const app = createServer();

describe('GET /api/collaborators/partners - Ruta para mostrar a los socios registrados', () => {
  let token: string;
  before(async () => {
    await dbConnection();
    token = await getToken();
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Listado de socios', (done) => {
    request(app)
      .get('/api/collaborators/partners')
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Lista de socios');
        res.body.partners.forEach((partner: any) => {
          expect(partner.id).to.be.a('string');
          expect(partner.name).to.be.a('string');
          expect(partner.representative).to.be.a('string');
          partner.services.forEach((service: any) => {
            expect(service.id).to.be.a('string');
            expect(service.status).to.be.a('string');
          });
        });
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .get('/api/collaborators/partners')
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
