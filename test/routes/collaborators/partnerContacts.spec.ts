import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('Pruebas para el endoint /collaborators/partners/contacts', () => {
    let token:string;
    let partnerId:string;
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
    it('POST /collaborators/partners/contacts Responds with 201 - Contacto creado exitosamente', (done) => {
        const data = {
            name: 'John Doe Test',
            role: 'Predinte de la empresa',
            phoneNumber: '+525533554499',
            email: 'john@doe.com',
            partner: partnerId,
        }
        request(app).post('/collaborators/partners/contacts')
            .set('token', token)
            .send(data)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Contacto creado');
                expect(res.body.contact.name).to.be.a('string');
                expect(res.body.contact.role).to.be.a('string');
                expect(res.body.contact.phoneNumber).to.be.a('string');
                expect(res.body.contact.email).to.be.a('string');
                expect(res.body.contact.partnerId).to.be.a('string');
                expect(res.body.contact.id).to.be.a('string');
                done();
            });
    });
    it('DELETE /collaborators/partners/contacts/{contactId} Responds with 405 - Test de proteccion a la ruta', (done) => {
        request(app).delete(`/collaborators/partners/contacts/${contactId}`)
            .expect('Content-type', /json/)
            .expect(405, done);
    });
});