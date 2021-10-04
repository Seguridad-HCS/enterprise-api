import { expect } from 'chai';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import dotenv from 'dotenv';
import { getConnection } from 'typeorm';

import dbConnection from '../../../src/dbConnection';
import createServer from '../../../src/server';

const app = createServer();
dotenv.config();

describe('GET /collaborators/employees/{employeeId} - Ruta para mostrar un colaborador especifico', () => {
    let token:string;
    let employeeId:string;
    let newEmployeeId:string;
    let profileId:string;
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
                const payload = jwt.verify(token, <string>process.env.SERVER_TOKEN) as jwt.JwtPayload;
                employeeId = payload.data;
                done();
            });
        });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('200 - Muestra el registro completo de un colaborador', (done) => {
        request(app).get(`/collaborators/employees/${employeeId}`)
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.employee.id).to.be.a('string');
                expect(res.body.employee.name).to.be.a('string');
                expect(res.body.employee.surname).to.be.a('string');
                expect(res.body.employee.secondSurname).to.be.a('string');
                expect(res.body.employee.sex).to.be.a('boolean');
                expect(res.body.employee.birthDate).to.be.a('string');
                expect(res.body.employee.createdAt).to.be.a('string');
                expect(res.body.employee.email).to.be.a('string');
                expect(res.body.employee.password).to.be.undefined;
                expect(res.body.employee.nss).to.be.a('string');
                expect(res.body.employee.bloodtype).to.be.a('string');
                expect(res.body.employee.rfc).to.be.a('string');
                expect(res.body.employee.baseWage).to.be.a('number');
                // TODO Pendientes para el flujo de registro de empleado
                // expect(res.body.employee.profile.id).to.be.a('number');
                // expect(res.body.employee.profile.total).to.be.a('number');
                // expect(res.body.employee.profile.minAge).to.be.a('number');
                // expect(res.body.employee.profile.maxAge).to.be.a('number');
                // expect(res.body.employee.profile.sex).to.be.a('number');
                done();
            });
    });
    it('404 - El empleado no fue encontrado', done => {
        request(app).get(`/collaborators/employees/${newEmployeeId}`)
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Colaborador no encontrado');
                done();
            });
    });
    it('405 - Test de proteccion a la ruta', done => {
        request(app).get(`/collaborators/employees/${newEmployeeId}`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});