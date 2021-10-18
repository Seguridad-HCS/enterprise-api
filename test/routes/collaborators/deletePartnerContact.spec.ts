import request from 'supertest';
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';
import getPrtnLessContacts from '../../helpers/getPartnerLessContacts.helper';

const app = createServer();

describe('DELETE /api/collaborators/partners/contacts/<contactsId> - Elimina el contacto de un socio', () => {
  let token: string;
  let contactId: string | undefined;
  before(async () => {
    await dbConnection();
    token = await getToken();
    const prtn = await getPrtnLessContacts();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    contactId = prtn.contacts![0].id;
    if (!contactId) throw Error('No contact');
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Contacto eliminado', (done) => {
    request(app)
      .delete(`/api/collaborators/partners/contacts/${contactId}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Contacto eliminado');
        done();
      });
  });
  it('404 - Contacto no encontrado', (done) => {
    request(app)
      .delete(`/api/collaborators/partners/contacts/1`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Contacto no encontrado');
        done();
      });
  });
  it('405 - Debe existir al menos un contacto si el socio tiene servicios activos 405 TESTEO PENDIENTE', (done) => {
    request(app)
      .delete(`/api/collaborators/partners/contacts/thiisatest`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Contacto no encontrado');
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .delete(`/api/collaborators/partners/contacts/${contactId}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
