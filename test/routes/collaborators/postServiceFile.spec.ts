import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('POST /collaborators/services/file - Ruta de creacion de archivo de servicio', () => {
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
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('201 - Archivo creado exitosamente', (done) => {
        request(app).post('/collaborators/services/files')
            .set('token', token)
            .send({
                partner: partnerId,
            })
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Servicio creado');
                expect(res.body.service.id).to.be.a('string');
                done();
            });
    });
    it('404 - El servicio no fue encontrado', (done) => {
        // TODO especificar el objeto que se recibe
        request(app).post('/collaborators/services/files')
            .set('token', token)
            .send({
                partnerId: 'thisisatest'
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).to.equal('Servicio no encontrado');
                done();
            });
    });
    it('405 - El archivo no se puede modificar', (done) => {
        request(app).post('/collaborators/services/files')
            .set('token', token)
            .send({
                partner: partnerId,
            })
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Ya hay un servicio en proceso');
                done();
            });
    });
    it('405 - Test de proteccion a la ruta', done => {
        request(app).post(`/collaborators/services/files`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});