const _ = require('lodash');
const uuid = require('uuid/v4');
const logger = require('../logger');

module.exports = async (ctx, next) => {
  ctx.startTimeInMs = Date.now();

  // create a specific logger instance for this request, pin some context on it.
  const requestId = ctx.request.headers['x-request-id'] || uuid();
  ctx.logger = logger.child({requestId});

  const logContext = _.pick(ctx.request, [
    'params', 'query', 'originalUrl', 'method',
  ]);

  ctx.logger.info(logContext, 'Handling request');

  let logFunc = ctx.logger.info.bind(ctx.logger);
  let status;

  try {
    await next();
  } catch (error) {
    status = (error && error.statusCode) || 500;
    logFunc = status < 500 ? ctx.logger.warn.bind(ctx.logger) :
                             ctx.logger.error.bind(ctx.logger);
    logContext.error = error;
    throw error;
  } finally {
    logContext.duration = Date.now() - ctx.startTimeInMs;
    logContext.status = status || ctx.response.status;
    logFunc(logContext, 'Reply sent');
  }
};
