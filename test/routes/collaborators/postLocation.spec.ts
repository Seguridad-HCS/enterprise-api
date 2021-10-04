import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('POST /collaborators/locations - Ruta de creacion de locaciones', () => {
    let token:string;
    const loginData = {
        email: 'johndoe@gmail.com',
        password: 'test'
    };
    before((done) => {
        dbConnection().then(() => {
            request(app).post('/collaborators/auth/login')
            .send(loginData)
            .end((err, res) => {
                if (err) return done(err);
                token = res.headers.token;
                done();
            });
        });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('201 - Ubicacion sin servicio creada', (done) => {
        const data = {
            name: 'Oficina de pruebas2',
            address: {
                street: 'Cipres',
                outNumber: 'Mz.12 Lt.10',
                intNumber: 'N/A',
                neighborhood: 'Narvarte',
                zip: '09950',
                municipality: 'Iztapalapa',
                state: 'Ciudad de Mexico'
            }
        }
        request(app).post('/collaborators/locations')
            .set('token', token)
            .send(data)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Locacion creada');
                expect(res.body.location).to.be.not.undefined;
                done();
            });
    });
    it('400 - Error en el input', (done) => {
        const data = {
            name: 'Oficina de pruebas2',
            address: {
                streeto: 'Cipres',
                outNumber: 'Mz.12 Lt.10',
                intNumber: 'N/A',
                neighborhood: 'Narvarte',
                zip: '09950',
                municipality: 'Iztapalapa',
                state: 'Ciudad de Mexico'
            }
        }
        request(app).post('/collaborators/locations')
            .set('token', token)
            .send(data)
            .expect('Content-type', /json/)
            .expect(400)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).to.equal('Error en el input');
                done();
            });
    });
    it('405 - Test de proteccion a la ruta', done => {
        request(app).post(`/collaborators/locations`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});