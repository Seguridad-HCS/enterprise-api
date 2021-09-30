import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('Endpoints de perfiles para locacion para colaboradores', () => {
    let token:string;
    let locationId:number;
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
                // Get some random partnerId
                request(app).get('/collaborators/locations')
                    .set('token', token)
                    .end((err, res) => {
                        if (err) return done(err);
                        locationId = res.body.locations![0].id;
                        done();
                    });
            });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('POST /collaborators/locations/profiles Responds with 200 - Crea un nuevo perfil asociado a una locacion', (done) => {
        const data = {
            "total": 1,
            "minAge": 18,
            "maxAge": 45,
            "price": 3500000,
            "minWage": 300000,
            "maxWage": 500000,
            "sex": true,
            "position": 1,
            "location": locationId
        }
        request(app).post('/collaborators/locations/profiles')
            .set('token', token)
            .send(data)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Perfil creado');
                expect(res.body.profile.id).to.be.a('number');
                expect(res.body.profile.total).to.be.a('number');
                expect(res.body.profile.minAge).to.be.a('number');
                expect(res.body.profile.maxAge).to.be.a('number');
                expect(res.body.profile.price).to.be.a('number');
                expect(res.body.profile.sex).to.be.a('boolean');
                expect(res.body.profile.minWage).to.be.a('number');
                expect(res.body.profile.maxWage).to.be.a('number');
                expect(res.body.profile.positionId).to.a('number');
                expect(res.body.profile.locationId).to.a('number');
                locationId = res.body.profile.id;
                done();
            });
    });
    it('DELETE /collaborators/locations/profiles/<profileId> Responds with 200 - Elimina un perfil asociado a una locacion', (done) => {
        request(app).delete(`/collaborators/locations/profiles/${locationId}`)
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Perfil eliminado');
                done();
            });
    });
});