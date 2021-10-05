import request from 'supertest';

import createServer from '../../src/server';
import dbConnection from '../../src/dbConnection';
import { expect } from 'chai';

const app = createServer();

describe('Server checks', async () => {
  it('Server is created without error', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
