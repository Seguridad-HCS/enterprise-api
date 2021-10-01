import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('Pruebas para el endoint /collaborators/auth/logout', () => {
    let token:string;
    const userData = {
        email: 'oscarmartinez1998lol@gmail.com',
        password: 'test'
    };
    before((done) => {
        dbConnection().then(() => done());
    });
    beforeEach((done) => {
        request(app).post('/collaborators/auth/login')
            .send(userData)
            .end((err, res) => {
                if (err) return done(err);
                token = res.headers.token;
                done();
            });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('POST /collaborators/auth/logout Responds with 200 - Sesion finalizada exitosamente', (done) => {
        request(app).post('/collaborators/auth/logout')
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Sesion finalizada');
                done();
            });
    });
    it('POST /collaborators/auth/logout Responds with 501 - Test de proteccion a la ruta', (done) => {
        request(app).post('/collaborators/auth/logout')
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});