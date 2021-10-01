import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('Pruebas para el endoint /collaborators/partners', () => {
    let token:string;
    let partnerId:string;
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
    it('POST /collaborators/partners Responds with 201 - Socio registrado exitosamente', (done) => {
        request(app).post('/collaborators/partners')
            .set('token', token)
            .send({
                name: 'Oxxo',
                legalName: 'Abarrotes corporativos Oxxo S.a. de C.V.',
                rfc: 'MAVO980605',
                representative: 'Oscar Martinez Vazquez',
                email: 'oscarmartinez1998@hotmail.es',
                phoneNumber: '+525536593166'
            })
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Socio creado');
                partnerId = res.body.partner.id;
                done();
            });
    });
    it('POST /collaborators/partners Responds with 400 - Error en el input', (done) => {
        request(app).post('/collaborators/partners')
            .set('token', token)
            .send({
                nane: 'Oxxo',
                legalName: 'Abarrotes corporativos Oxxo S.a. de C.V.',
                rfc: 'MAVO980605',
                representative: 'Oscar Martinez Vazquez',
                email: 'oscarmartinez1998@hotmail.es',
                phoneNumber: '+525536593166'
            })
            .expect('Content-type', /json/)
            .expect(400, done);
    });
    it('GET /collaborators/partners Responds with 405 - Test de proteccion a la ruta', done => {
        request(app).post(`/collaborators/partners`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
    it('GET /collaborators/partners/{partnerId} Responds with 200 - Muestra al socio', done => {
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
    it('DELETE /collaborators/partners Responds with 200 - El socio fue eliminado exitosamente', done => {
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
    it('GET /collaborators/partners Responds with 200 - Muestra a los socios registrados', (done) => {
        request(app).get('/collaborators/partners')
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Lista de socios');
                done();
            });
    });
});