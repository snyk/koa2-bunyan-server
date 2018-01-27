const sleep = require('then-sleep');
const httpErrors = require('http-errors');

module.exports = async (ctx) => {
  const sleepDurationInMs = Number(ctx.request.query.duration) || 100;

  ctx.logger.info({sleepDurationInMs}, 'Going to sleep for a while');

  await sleep(sleepDurationInMs);

  ctx.logger.info({sleepDurationInMs}, 'Woke up!');

  const shouldExplode = !!ctx.request.query.error;
  if (shouldExplode) {
    const err = new httpErrors.NotImplemented('BOOM!');
    err.sleptInMs = sleepDurationInMs;
    ctx.throw(err);
  } else {
    ctx.response.status = 200;
    ctx.response.body = { sleptInMs: sleepDurationInMs };
  }
};
