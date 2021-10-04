import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('POST /collaborators/auth/recover - Solicita un token de recuperacion de correo', () => {
    before(done => {
        dbConnection().then(() => done());
    });
    after(done => {
        getConnection().close();
        done();
    });
    it('200 - Se ha enviado un correo de recuperacion al correo registrado PENDIENTE', done => {
        request(app).post('/collaborators/auth/reboot')
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                //expect(res.body.server).to.equal('Para continuar el proceso accede a tu correo electronico');
                done();
            });
    });
});