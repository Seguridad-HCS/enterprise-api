import request from 'supertest';

import createServer from '../../../src/server';

const app = createServer();

describe('Executive functions', () => {
    it('/collaborator/ex/employee Register a new employee', (done) => {
        request(app).post('/collaborator/hr/employee')
            .send({
                name: 'Oscar',
                surname: 'Martinez',
                secondSurname: 'Vazquez',
                email: 'oscarmartinez1998lol@gmail.com',
                nss: '8739867492',
                bloodtype: 'A+',
                rfc: 'MAVO980605',
                sex: 'Male',
                birthDate: '01-01-1998'
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({ server: 'Registro exitoso' })
            .expect(200, done);
    });
});