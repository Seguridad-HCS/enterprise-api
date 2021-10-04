import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('POST /collaborators/locations/profiles - Ruta de creacion de perfil de locacion', () => {
    let token:string;
    let locationId:string;
    let positionId:string;
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
                // Get some random partnerId
                request(app).get('/collaborators/locations')
                    .set('token', token)
                    .end((err, res) => {
                        if (err) return done(err);
                        locationId = res.body.locations![0].id;
                        request(app).get('/collaborators/employees/positions')
                            .set('token', token)
                            .end((err, res) => {
                                if (err) return done(err);
                                positionId = res.body.positions![0].id;
                                done();
                            });
                    });
            });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('201 - Perfil de locacion registrado', (done) => {
        request(app).post('/collaborators/locations/profiles')
            .set('token', token)
            .send({
                "total": 1,
                "minAge": 18,
                "maxAge": 45,
                "price": 3500000,
                "minWage": 300000,
                "maxWage": 500000,
                "sex": true,
                "position": positionId,
                "location": locationId
            })
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Perfil creado');
                expect(res.body.profile.id).to.be.a('string');
                expect(res.body.profile.total).to.be.a('number');
                expect(res.body.profile.minAge).to.be.a('number');
                expect(res.body.profile.maxAge).to.be.a('number');
                expect(res.body.profile.price).to.be.a('number');
                expect(res.body.profile.sex).to.be.a('boolean');
                expect(res.body.profile.minWage).to.be.a('number');
                expect(res.body.profile.maxWage).to.be.a('number');
                expect(res.body.profile.positionId).to.a('string');
                expect(res.body.profile.locationId).to.a('string');
                done();
            });
    });
    it('400 - Error en el input', (done) => {
        request(app).post('/collaborators/locations/profiles')
            .set('token', token)
            .send({
                "eltotal": 1,
                "minAge": 18,
                "maxAge": 45,
                "price": 3500000,
                "minWage": 300000,
                "maxWage": 500000,
                "sex": true,
                "position": positionId,
                "location": locationId
            })
            .expect('Content-type', /json/)
            .expect(400)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).to.equal('Error en el input');
                done();
            });
    });
    it('404 - Llaves foraneas validas o incorrectas', (done) => {
        request(app).post('/collaborators/locations/profiles')
            .set('token', token)
            .send({
                "total": 1,
                "minAge": 18,
                "maxAge": 45,
                "price": 3500000,
                "minWage": 300000,
                "maxWage": 500000,
                "sex": true,
                "position": 'test',
                "location": 'sample'
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).to.equal('Llaves foraneas invalidas o incorrectas');
                done();
            });
    });
    it('405 - Test de proteccion a la ruta', done => {
        request(app).post(`/collaborators/locations/profiles`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});