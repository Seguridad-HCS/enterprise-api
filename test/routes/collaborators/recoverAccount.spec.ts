import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('Endpoints generados para recuperar una cuenta de tipo colaborador', () => {
    before(done => {
        dbConnection().then(() => done());
    });
    after(done => {
        getConnection().close();
        done();
    });
    it('POST /collaborators/auth/reboot Responds with 200 - Se ha enviado un correo de recuperacion al correo registrado', done => {
        request(app).post('/collaborators/auth/reboot')
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                //expect(res.body.server).to.equal('Para continuar el proceso accede a tu correo electronico');
                done();
            });
    });
    it('POST /collaborators/auth/recover Responds with 200 - Se ha restablecido la contraseña', done => {
        request(app).put('/collaborators/auth/recover')
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                //expect(res.body.server).to.equal('Contraseña actualizada');
                done();
            });
    });
});