import request from 'supertest';
import { getConnection } from 'typeorm';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';
import { expect } from 'chai';

const app = createServer();

describe('Login endpoint - collaborators', () => {
    before(async() => await dbConnection());
    after(async() => await getConnection().close());
    it('/collaborator/login Responds with 200 - Correct credentials', (done) => {
        request(app).post('/collaborator/login')
            .send({
                email: 'oscarmartinez1998lol@gmail.com',
                password: 'test'
            })
            .expect('Content-type',/json/)
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.headers.token).to.exist;
                expect(res.body.name).exist;
                expect(res.body.role).exist;
                done();
            });
    });
    it('/collaborator/login Responds with 404 - Incorrect email', (done) => {
        request(app).post('/collaborator/login')
            .send({
                email: 'test@gmail.com',
                password: 'test'
            })
            .expect('Content-type',/json/)
            .expect(404)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.headers.token).to.undefined;
                expect(res.body.server).to.equal('Usuario no encontrado');
                done();
            });
    });
    it('/collaborator/login Responds with 404 - Incorrect password', (done) => {
        request(app).post('/collaborator/login')
            .send({
                email: 'oscarmartinez1998lol@gmail.com',
                password: 'testa'
            })
            .expect('Content-type',/json/)
            .expect(404)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.headers.token).to.undefined;
                expect(res.body.server).to.equal('Usuario no encontrado');
                done();
            });
    });
    it('/collaborator/login Responds with 404 - SQL Injection', (done) => {
        request(app).post('/collaborator/login')
            .send({
                email: ' or "1"="1"',
                password: ' or "1"="1"'
            })
            .expect('Content-type',/json/)
            .expect(404)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.headers.token).to.undefined;
                expect(res.body.server).to.equal('Usuario no encontrado');
                done();
            });
    });
});