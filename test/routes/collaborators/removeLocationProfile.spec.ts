import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';

import LocationProfile from '../../../src/models/LocationProfile.model';

const app = createServer();

describe('DELETE /api/collaborators/locations/profiles/<profileId> - Elimina un perfil de locacion', () => {
  let token: string;
  let profiles: string[];
  before(async () => {
    await dbConnection();
    token = await getToken();
    // [0: no employees, 1: employees]
    profiles = await getProfileIds();
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Elimina un perfil asociado a una locacion', (done) => {
    request(app)
      .delete(`/api/collaborators/locations/profiles/${profiles[0]}`)
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
      .delete(`/api/collaborators/locations/profiles/${profiles[1]}`)
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
      .delete(`/api/collaborators/locations/profiles/${profiles[1]}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
const getProfileIds = async (): Promise<string[]> => {
  const locProfileRepo = getRepository(LocationProfile);
  const profiles = await locProfileRepo
    .createQueryBuilder('profile')
    .leftJoinAndSelect('profile.employees', 'employees')
    .getMany();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const aux1 = profiles.find((profile) => profile.employees!.length > 0);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const aux2 = profiles.find((profile) => profile.employees!.length === 0);
  if (!aux1 || !aux1.id) throw Error('No profile with employees');
  if (!aux2 || !aux2.id) throw Error('No profile without service');
  const withEmployees = aux2.id;
  const withoutEmployees = aux1.id;
  return [withEmployees, withoutEmployees];
};
