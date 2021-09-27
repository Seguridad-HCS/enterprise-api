import { expect } from 'chai';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import dotenv from 'dotenv';
import { getConnection } from 'typeorm';

import dbConnection from '../../../src/dbConnection';
import createServer from '../../../src/server';

const app = createServer();
dotenv.config();

describe('Collaborators endpoints', () => {
    let token:string;
    let employeeId:string;
    let newEmployeeId:string;
    const noManager = {
        email: 'oscarmartinez1998lol@gmail.com',
        password: 'test'
    };
    before((done) => {
        dbConnection().then(() => {
            request(app).post('/collaborators/auth/login')
            .send(noManager)
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
    it('POST /collaborators/employees Registra un nuevo empleado en el sistema', (done) => {
        request(app).post('/collaborators/employees/')
            .set('token', token)
            .send({
                name: 'Test',
                surname: 'Example',
                secondsurname: 'Sample',
                email: 'test@example.com',
                password: 'test',
                nss: '8964296',
                bloodtype: 'A+',
                rfc: 'MAVO980605',
                birthDate: '05-06-1998',
                sex: true,
                baseWage: 4500000,
                locationProfileId: 1
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(201)
            .end((err, res) => {
                if(err) return done(err);
                newEmployeeId = res.body.employee.id;
                done();
            });
    });
    it('DELETE /collaborators/employees/{employeeId} Elimina a un colaborador del sistema', done => {
        request(app).delete(`/collaborators/employees/${newEmployeeId}`)
            .set('token', token)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).to.equal('Colaborador eliminado');
                done();
            });
    });
    it('GET /collaborators/employees/{employeeId} Muestra el registro completo de un colaborador', (done) => {
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
});