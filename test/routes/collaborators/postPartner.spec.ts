import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('POST /collaborators/partners - Registra a un colaborador en el sistema', () => {
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
    it('201 - Socio registrado', (done) => {
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
                done();
            });
    });
    it('400 - Error en el input', (done) => {
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
            .expect(400)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).to.equal('Error en el input');
                done();
            });
    });
    it('405 - Test de proteccion a la ruta', done => {
        request(app).post(`/collaborators/partners`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});