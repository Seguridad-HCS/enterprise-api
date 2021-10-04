import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('POST /collaborators/auth/logout - Ruta para cerrar sesion de un colaborador', () => {
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
    it('200 - Sesion finalizada exitosamente', (done) => {
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
    it('405 - Test de proteccion a la ruta', (done) => {
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