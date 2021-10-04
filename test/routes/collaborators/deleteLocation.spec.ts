import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('DELETE /collaborators/locations/<locationId> - Ruta para eliminar una locacion', () => {
    let token:string;
    let locationWithoutEmployees:number;
    let locationWithEmployees: number;
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
                request(app).get('/collaborators/locations')
                    .set('token', token)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.body.locations.forEach((location:any) => {
                            if(location.hr.hired == 0) locationWithoutEmployees = location.id;
                            else locationWithEmployees = location.id;
                        });
                        done();
                    });
            });
        });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('200 - Eliminar una locacion sin colaboradores', (done) => {
        request(app).delete(`/collaborators/locations/${locationWithoutEmployees}`)
            .set('token', token)
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).eql('Locacion eliminada');
                done();
            });
    });
    it('404 - La locacion no fue encontrada', (done) => {
        request(app).delete(`/collaborators/locations/1`)
            .set('token', token)
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Locacion no encontrada');
                done();
            });
    });
    it('405 - No se puede eliminar una locacion con colaboradores', (done) => {
        request(app).delete(`/collaborators/locations/${locationWithEmployees}`)
            .set('token', token)
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(405)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).eql('La locacion aun cuenta con colaboradores activos');
                done();
            });
    });
    it('405 - Test de proteccion a la ruta', done => {
        request(app).delete(`/collaborators/locations/${locationWithoutEmployees}`)
            .expect('Content-type', /json/)
            .expect(405)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Token corrupto');
                done();
            });
    });
});