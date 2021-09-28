import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('Endpoint para finalizar sesion de colaboradores', () => {
    let token:string;
    let contactId:number;
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
    it('POST /collaborators/partners/contacts Responds with 201 - Contacto creado exitosamente', (done) => {
        request(app).post('/collaborators/partners/contacts')
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Contacto creado');
                done();
            });
    });
    it('DELETE /collaborators/partners/contacts/{contactId} Responds with 501 - No se pudo acceder a la ruta', (done) => {
        request(app).delete(`/collaborators/partners/contacts/${contactId}`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});