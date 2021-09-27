import request from 'supertest';
import { getConnection } from 'typeorm';
import { expect } from 'chai';
import createServer from '../../../src/server';
import dbConnection from '../../../src/dbConnection';

const app = createServer();

describe('Endpoints de locaciones para colaboradores', () => {
    let token:string;
    let testLocationId:number;
    const manager = {
        email: 'oscar@hotmail.es',
        password: 'test'
    }
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
                done();
            });
        });
    });
    after((done) => {
        getConnection().close();
        done();
    });
    it('POST /collaborators/locations Responds with 200 - Ubicacion sin servicio creada exitosamente', (done) => {
        const data = {
            name: 'Oficina de pruebas2',
            address: {
                street: 'Cipres',
                outNumber: 'Mz.12 Lt.10',
                intNumber: 'N/A',
                neighborhood: 'Narvarte',
                zip: '09950',
                municipality: 'Iztapalapa',
                state: 'Ciudad de Mexico'
            }
        }
        request(app).post('/collaborators/locations')
            .set('token', token)
            .send(data)
            .expect('Content-type', /json/)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Locacion creada exitosamente');
                expect(res.body.location).to.be.not.undefined;
                testLocationId = res.body.location.id;
                done();
            });
    });
    it('DELETE /collaborators/locations/<locationId> Responds with 200 - Eliminar una ubicacion sin colaboradores', (done) => {
        request(app).delete(`/collaborators/locations/${testLocationId}`)
            .set('token', token)
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.body.server).eql('Locacion eliminada exitosamente');
                done();
            });
    });
    it('GET /collaborators/locations Responds with 200 - Listado de ubicaciones', (done) => {
        request(app).get('/collaborators/locations')
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.eql('Lista de instalaciones');
                expect(res.body.locations).to.be.an('array');
                done();
            });
    });
    it('GET /collaborators/locations?owner=0 Responds with 200 - Listado de ubicaciones internas de HCS', (done) => {
        request(app).get('/collaborators/locations?owner=0')
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Lista de instalaciones');
                expect(res.body.locations).to.be.an('array');
                res.body.locations.forEach((location:any) => {
                    expect(location.owner).eql('Seguridad HCS');
                });
                done();
            });
    });
    it('GET /collaborators/locations?owner=1 Responds with 200 - Listado de ubicaciones de socios', (done) => {
        request(app).get('/collaborators/locations?owner=1')
            .set('token', token)
            .expect('Content-type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.server).to.equal('Lista de instalaciones');
                expect(res.body.locations).to.be.an('array');
                res.body.locations.forEach((location:any) => {
                    expect(location.owner).eql('Servicio externo');
                });
                done();
            });
    });
    it('GET /collaborators/locations/1 Responds with 200 - Obtener ubicacion especifica', (done) => {
        request(app).get('/collaborators/locations/1')
            .set('token', token)
            .expect('Content-type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.location.id).to.be.a('number');
                expect(res.body.location.name).to.be.a('string');
                expect(res.body.location.status).to.be.a('boolean');
                expect(res.body.location.service).to.be.not.undefined;
                expect(res.body.location.address).to.be.a('object');
                expect(res.body.location.profiles).to.be.an('array');
                done();
            });
    });
});