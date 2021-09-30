import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('Endpoint para finalizar sesion de colaboradores', () => {
    let token:string;
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
    it('GET /collaborators/employees/positions Responds with 200 - Muestra a las posiciones disponibles en el sistema', (done) => {
        request(app).get('/collaborators/employees/positions')
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Listado de posiciones');
                expect(res.body.positions).to.be.an('array');
                res.body.positions.forEach((location:any) => {
                    expect(location.id).to.be.a('string');
                    expect(location.name).to.be.a('string');
                    expect(location.department).to.be.a('string');
                });
                done();
            });
    });
    it('GET /collaborators/employees/positions Responds with 405 - El usuario no esta autenticado', (done) => {
        request(app).get('/collaborators/employees/positions')
            .expect('Content-type', /json/)
            .expect(405, done);
    });
});