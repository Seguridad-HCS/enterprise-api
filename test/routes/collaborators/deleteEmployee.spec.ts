import { expect } from 'chai';
import request from 'supertest';
import dotenv from 'dotenv';
import { getConnection } from 'typeorm';

import dbConnection from '../../../src/dbConnection';
import createServer from '../../../src/server';

const app = createServer();
dotenv.config();

describe('DELETE /collaborators/employees - Ruta para eliminar un colaborador', () => {
    let token:string;
    let employeeId:string;
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
                // Get some employeeId
                request(app).get('/collaborators/employees')
                    .set('token', token)
                    .end((err, res) => {
                        if (err) return done(err);
                        employeeId = res.body.employees![0].id;
                        done();
                    });
            });
        });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('200 - Elimina a un colaborador del sistema', done => {
        request(app).delete(`/collaborators/employees/${employeeId}`)
            .set('token', token)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).to.equal('Colaborador eliminado');
                done();
            });
    });
    it('404 - Empleado no encontrado', done => {
        request(app).delete(`/collaborators/employees/1`)
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Empleado no encontrado');
                done();
            });
    });
    it('405 - Test de proteccion a la ruta', done => {
        request(app).delete(`/collaborators/employees/${employeeId}`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});