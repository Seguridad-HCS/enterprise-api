import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('GET /collaborators/partners - Ruta para mostrar un socio en especifico', () => {
    let token:string;
    let partnerId:string;
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
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('200 - Muestra el registro completo de un socio', done => {
        request(app).get(`/collaborators/partners/${partnerId}`)
            .set('token', token)
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.partner.id).to.be.a('string');
                expect(res.body.partner.name).to.be.a('string');
                expect(res.body.partner.legalName).to.be.a('string');
                expect(res.body.partner.rfc).to.be.a('string');
                expect(res.body.partner.representative).to.be.a('string');
                expect(res.body.partner.phoneNumber).to.be.a('string');
                expect(res.body.partner.email).to.be.a('string');
                expect(res.body.partner.contacts).to.be.an('array');
                done();
            });
    });
    it('404 - El socio no fue encontrado', done => {
        request(app).get(`/collaborators/partners/1`)
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
        request(app).get(`/collaborators/partners/${partnerId}`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});