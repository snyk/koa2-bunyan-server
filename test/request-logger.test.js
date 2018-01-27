const chai = require('chai');
chai.use(require('chai-subset'));
chai.use(require('chai-as-promised'));
chai.should();

const _ = require('lodash');
const httpErrors = require('http-errors');
const requestLogger = require('../src/middleware/request-logger');

const ctxTemplate = {
  request: {
    url: '/test',
    body: {a: 1, b: 2},
    query: {c: 3, d: 4},
    headers: {
      'x-request-id': 'foo-bar',
    },
  },
  response: {
    body: {all: 'ok'},
    status: 200,
  },
  state: {},
};

describe('request logger', () => {
  it('should create logContext on normal handling', async () => {
    const ctx = _.cloneDeep(ctxTemplate);
    const next = () => {}; // noop

    // apply middleware
    await requestLogger(ctx, next);

    // assert non modified context keys
    ctx.request.should.deep.equal(ctxTemplate.request);
    ctx.response.should.deep.equal(ctxTemplate.response);

    // assert logger instance creation
    ctx.logger.should.not.be.undefined;
    ctx.logger.info.should.not.be.undefined;
    ctx.logger.warn.should.not.be.undefined;
    ctx.logger.error.should.not.be.undefined;
  });

  it('should create logContext when http error is thrown', async () => {
    const ctx = _.cloneDeep(ctxTemplate);
    const testError = new httpErrors.UnprocessableEntity('Example error');
    const next = () => {
      throw testError;
    }; // explode

    // apply middleware, assert exception is thrown
    try {
      await requestLogger(ctx, next);
      throw new Error('SHOULD HAVE THROWN BEFORE ME');
    } catch (error) {
      // assert error is rethrown and is unmodified
      error.should.deep.equal(testError);
    }

    // assert non modified context keys
    ctx.request.should.deep.equal(ctxTemplate.request);
    ctx.response.should.deep.equal(ctxTemplate.response);

    // assert logger instance creation
    ctx.logger.should.not.be.undefined;
    ctx.logger.info.should.not.be.undefined;
    ctx.logger.warn.should.not.be.undefined;
    ctx.logger.error.should.not.be.undefined;
  });

  it('should create logContext when generic error is thrown', async () => {
    const ctx = _.cloneDeep(ctxTemplate);
    const testError = new Error('Example error');
    const next = () => {
      throw testError;
    }; // explode

    // apply middleware, assert exception is thrown
    try {
      await requestLogger(ctx, next);
      throw new Error('SHOULD HAVE THROWN BEFORE ME');
    } catch (error) {
      // assert error is rethrown and is unmodified
      error.should.deep.equal(testError);
    }

    // assert non modified context keys
    ctx.request.should.deep.equal(ctxTemplate.request);
    ctx.response.should.deep.equal(ctxTemplate.response);

    // assert logger instance creation
    ctx.logger.should.not.be.undefined;
    ctx.logger.info.should.not.be.undefined;
    ctx.logger.warn.should.not.be.undefined;
    ctx.logger.error.should.not.be.undefined;
  });
});
