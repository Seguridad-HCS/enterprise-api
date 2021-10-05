import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('POST /collaborators/partners/contacts - Ruta de creacion de contacto de un socio', () => {
  let token: string;
  let partnerId: string;
  const loginData = {
    email: 'johndoe@gmail.com',
    password: 'test'
  };
  before((done) => {
    dbConnection().then(() => {
      request(app)
        .post('/collaborators/auth/login')
        .send(loginData)
        .end((err, res) => {
          if (err) return done(err);
          token = res.headers.token;
          // Get some random partnerId
          request(app)
            .get('/collaborators/partners')
            .set('token', token)
            .end((err, res) => {
              if (err) return done(err);
              partnerId = res.body.partners![0].id;
              done();
            });
        });
    });
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('201 - Contacto creado exitosamente', (done) => {
    request(app)
      .post('/collaborators/partners/contacts')
      .set('token', token)
      .send({
        name: 'John Doe Test',
        role: 'Predinte de la empresa',
        phoneNumber: '+525533554499',
        email: 'john@doe.com',
        partner: partnerId
      })
      .expect('Content-type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Contacto creado');
        expect(res.body.contact.name).to.be.a('string');
        expect(res.body.contact.role).to.be.a('string');
        expect(res.body.contact.phoneNumber).to.be.a('string');
        expect(res.body.contact.email).to.be.a('string');
        expect(res.body.contact.partnerId).to.be.a('string');
        expect(res.body.contact.id).to.be.a('string');
        done();
      });
  });
  it('400 - Error en el input', (done) => {
    request(app)
      .post('/collaborators/partners/contacts')
      .set('token', token)
      .send({
        nane: 'John Doe Test',
        role: 'Predinte de la empresa',
        phoneNumber: '+525533554499',
        email: 'john@doe.com',
        partner: partnerId
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Error en el input');
        done();
      });
  });
  it('404 - El socio no fue encontrado', (done) => {
    // TODO especificar el objeto que se recibe
    request(app)
      .post('/collaborators/partners/contacts')
      .set('token', token)
      .send({
        name: 'John Doe Test',
        role: 'Predinte de la empresa',
        phoneNumber: '+525533554499',
        email: 'john@doe.com',
        partner: 'thisisatest'
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Socio no encontrado');
        done();
      });
  });
  it('405 - Se ha alcanzado el limite de contactos en un socio TESTEO PENDIENTE', (done) => {
    done();
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .post(`/collaborators/partners/contacts`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
