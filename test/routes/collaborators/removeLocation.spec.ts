import request from 'supertest';
import { getConnection, getRepository } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

import getToken from '../../helpers/getToken.helper';

import Location from '../../../src/models/Location.model';

const app = createServer();

describe('DELETE /api/collaborators/locations/<locationId> - Elimina una locacion', () => {
  let token: string;
  let locationIds: string[];
  before(async () => {
    await dbConnection();
    token = await getToken();
    // [0: no employees, 1: employees]
    locationIds = await getLocationIds();
  });
  after(async () => {
    await getConnection().close();
  });
  it('200 - Elimina una locacion sin colaboradores', (done) => {
    request(app)
      .delete(`/api/collaborators/locations/${locationIds[0]}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).eql('Locacion eliminada');
        done();
      });
  });
  it('404 - Locacion no fue encontrada', (done) => {
    request(app)
      .delete(`/api/collaborators/locations/1`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Locacion no encontrada');
        done();
      });
  });
  it('405 - No se puede eliminar una locacion con colaboradores', (done) => {
    request(app)
      .delete(`/api/collaborators/locations/${locationIds[1]}`)
      .set('token', token)
      .expect('Content-type', 'application/json; charset=utf-8')
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).eql(
          'La locacion aun cuenta con colaboradores activos'
        );
        done();
      });
  });
  it('405 - Test de proteccion a la ruta', (done) => {
    request(app)
      .delete(`/api/collaborators/locations/${locationIds[0]}`)
      .expect('Content-type', /json/)
      .expect(405)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.server).to.equal('Token corrupto');
        done();
      });
  });
});
const getLocationIds = async (): Promise<string[]> => {
  const locationRepo = getRepository(Location);
  const locations = await locationRepo
    .createQueryBuilder('location')
    .leftJoinAndSelect('location.profiles', 'profiles')
    .leftJoinAndSelect('profiles.employees', 'employees')
    .getMany();
  const aux1 = locations.find(hasEmployees);
  const aux2 = locations.find(hasNotEmployees);
  if (!aux1 || !aux1.id) throw Error('No location with employees');
  if (!aux2 || !aux2.id) throw Error('No location without service');
  const withEmployees = aux2.id;
  const withoutEmployees = aux1.id;
  return [withEmployees, withoutEmployees];
};
const hasEmployees = (location: Location): boolean => {
  let flag = false;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  location.profiles!.forEach((profile) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (profile.employees!.length > 0) {
      flag = true;
      return;
    }
  });
  return flag;
};
const hasNotEmployees = (location: Location): boolean => {
  return !hasEmployees(location);
};
