import request from 'supertest';

import createServer from '../../../src/server';

const app = createServer();

describe('Human resources functions', () => {
    it('/collaborator/hr/employee Register a new employee', (done) => {
        request(app).post('/collaborator/hr/employee')
            .send({
                name: '',
                surname: '',
                secondSurname: '',
                sex: 'Male',
                birthDate: '01-01-1998'
            })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect({ server: 'Registro exitoso' })
            .expect(200, done);
    });
});