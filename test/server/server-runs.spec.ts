import request from 'supertest';

import createServer from '../../src/server';
import { expect } from 'chai';

const app = createServer();

describe('Server checks', async () => {
  it('Server is created without error', (done) => {
    request(app)
      .get('/api')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.eql('Ok');
        done();
      });
  });
});
