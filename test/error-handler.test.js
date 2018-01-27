const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-subset'));
chai.use(require('chai-as-promised'));
chai.should();

const httpErrors = require('http-errors');
const _ = require('lodash');
const errorHandler = require('../src/middleware/error-handler');

const ctxTemplate = {
  request: {
    url: '/test',
    body: {a: 1, b: 2},
    query: {c: 3, d: 4},
  },
  response: {
    body: {all: 'ok'},
    status: 200,
  },
  state: {
    start: Date.now(),
  },
};

describe('error handler', () => {
  it('should not modify context if handler doesn\'t throw', async () => {
    const ctx = _.cloneDeep(ctxTemplate);
    const next = () => {}; // noop

    // apply middleware
    await errorHandler(ctx, next);

    // assert context was not modified
    ctx.should.deep.equal(ctxTemplate);
  });

  it('should modify context if handler throws generic error', async () => {
    const ctx = _.cloneDeep(ctxTemplate);
    const err = new Error('Testing 123');
    const next = () => {
      throw err;
    }; // explode

    // apply middleware
    expect(await errorHandler(ctx, next)).not.to.throw;

    // assert context request was not modified
    ctx.request.should.deep.equal(ctxTemplate.request);
    // assert context response was modified as expected
    ctx.response.should.deep.equal({
      body: {
        error: err,
        status: 500,
        message: err.message,
      },
      status: 500,
    });
  });

  it('should modify context if handler throws http error', async () => {
    const ctx = _.cloneDeep(ctxTemplate);
    const err = new httpErrors.BadGateway('Example error');
    const next = () => {
      throw err;
    }; // explode

    // apply middleware
    expect(await errorHandler(ctx, next)).not.to.throw;

    // assert context request was not modified
    ctx.request.should.deep.equal(ctxTemplate.request);
    // assert context response was modified as expected
    ctx.response.should.deep.equal({
      body: {
        error: err,
        status: httpErrors.BadGateway().statusCode,
        message: err.message,
      },
      status: httpErrors.BadGateway().statusCode,
    });
  });
});
