import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('DELETE /collaborators/partners/contacts - Elimina el contacto de un socio', () => {
    let token:string;
    let partnerId:string;
    let contactId:number;
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
                request(app).get('/collaborators/partners')
                    .set('token', token)
                    .end((err, res) => {
                        if (err) return done(err);
                        partnerId = res.body.partners![0].id;
                        done();
                    });
            });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    
    it('405 - Test de proteccion a la ruta', (done) => {
        request(app).delete(`/collaborators/partners/contacts/${contactId}`)
            .expect('Content-type', /json/)
            .expect(404, done);
    });
});