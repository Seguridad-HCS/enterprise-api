import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('DELETE /api/collaborators/locations/profiles/<profileId> - Elimina un perfil de locacion', () => {
  let token: string;
  let locationId: string;
  let profileWithEmployees: string;
  let profileWithoutEmployees: string;
  const loginData = {
    email: 'seguridadhcsdevs@gmail.com',
    password: 'thisIsAtest98!'
  };
  before((done) => {
    dbConnection().then(() => {
      request(app)
        .post('/api/collaborators/auth/login')
        .send(loginData)
        .end((err, res) => {
          if (err) return done(err);
          token = res.headers.token;
          // Get some random partnerId
          request(app)
            .get('/api/collaborators/locations')
            .set('token', token)
            .end((err, res) => {
              if (err) return done(err);
              locationId = res.body.locations[0].id;
              request(app)
                .get(`/api/collaborators/locations/${locationId}`)
                .set('token', token)
                .end((err, res) => {
                  if (err) return done(err);
                  res.body.location.profiles.forEach((profile: any) => {
                    if (profile.employees.length > 0)
                      profileWithEmployees = profile.id;
                    else profileWithoutEmployees = profile.id;
                  });
                  done();
                });
            });
        });
    });
  });
  after((done) => {
    getConnection().close();
    done();
  });
  it('200 - Elimina un perfil asociado a una locacion', (done) => {
    request(app)
      .delete(
        `/api/collaborators/locations/profiles/${profileWithoutEmployees}`
      )
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Perfil eliminado');
        done();
      });
  });
  it('404 - Perfil no encontrado', (done) => {
    request(app)
      .delete(`/api/collaborators/locations/profiles/thisIsATest`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Perfil no encontrado');
        done();
      });
  });
  it('405 - No se puede eliminar un perfil con colaboradores', (done) => {
    request(app)
      .delete(`/api/collaborators/locations/profiles/${profileWithEmployees}`)
      .set('token', token)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal(
          'Hay colaboradores asociados a este perfil'
        );
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .delete(`/api/collaborators/locations/profiles/${profileWithEmployees}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
