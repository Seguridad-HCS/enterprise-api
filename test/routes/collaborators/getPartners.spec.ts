
import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('GET /collaborators/partners - Ruta para mostrar a los socios registrados', () => {
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
                done();
            });
        });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('200 - Listado de socios', (done) => {
        request(app).get('/collaborators/partners')
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Lista de socios');
                res.body.partners.forEach((partner:any) => {
                    expect(partner.id).to.be.a('string');
                    expect(partner.name).to.be.a('string');
                    expect(partner.representative).to.be.a('string');
                    partner.services.forEach((service:any) => {
                        expect(service.id).to.be.a('string');
                        expect(service.status).to.be.a('string');
                    });
                });
                done();
            });
    });
    it('405 - Test de proteccion a la ruta', (done) => {
        request(app).get('/collaborators/partners')
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});