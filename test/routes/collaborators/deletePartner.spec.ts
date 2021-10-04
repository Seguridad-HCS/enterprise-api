import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('DELETE /collaborators/partners - Ruta para eliminar a un socio', () => {
    let token:string;
    let partnerId:string;
    const loginData = {
        email: 'johndoe@gmail.com',
        password: 'test'
    };
    before((done) => {
        dbConnection().then(() => done());
    });
    beforeEach((done) => {
        request(app).post('/collaborators/auth/login')
            .send(loginData)
            .end((err, res) => {
                if (err) return done(err);
                token = res.headers.token;
                // Get some partnerId
                request(app).get('/collaborators/partners')
                    .set('token', token)
                    .expect('Content-type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        partnerId = res.body.partners[0].id;
                        done();
                    });
            });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('200 - Elimina a un socio del sistema', done => {
        request(app).delete(`/collaborators/partners/${partnerId}`)
            .set('token', token)
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).to.equal('Socio eliminado');
                done();
            });
    });
    it('404 - El socio no fue encontrado', done => {
        request(app).delete(`/collaborators/partners/1`)
            .set('token', token)
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(404)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).to.equal('Socio no encontrado');
                done();
            });
    });
    it('405 - Test de proteccion a la ruta', (done) => {
        request(app).delete(`/collaborators/partners/${partnerId}`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});