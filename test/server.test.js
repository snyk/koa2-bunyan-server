const chai = require('chai');
chai.use(require('chai-subset'));
chai.use(require('chai-as-promised'));
chai.should();

const app = require('../src/index');
const request = require('supertest-as-promised')(app);

after(() => {
  app.close();
});

describe('sleep controller', () => {
  it('works with no query param', async () => {
    const res = await request.get('/');

    res.status.should.equal(200);
    res.body.sleptInMs.should.not.be.undefined;
  });

  it('works with sleep duration specified as a query param', async () => {
    const duration = Math.floor(Math.random() * 50);
    const res = await request.get('/').query({ duration });

    res.status.should.equal(200);
    res.body.sleptInMs.should.equal(duration);
  });

  it('works with an error query param', async () => {
    await request.get('/').query({ error: true })
    .then(res => {
      res.statusCode.should.equal(501);
    });
  });

  it('works with both error and duration query params', async () => {
    const duration = Math.floor(Math.random() * 50);
    await request.get('/').query({ duration, error: true })
    .then(res => {
      res.statusCode.should.equal(501);
    })
  });
});
