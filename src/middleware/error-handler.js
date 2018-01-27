const httpErrors = require('http-errors');

// this middleware makes sure that responses
// conform to a standard when errors occur
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const status = error.statusCode || error.status || httpErrors.InternalServerError().status;

    ctx.response.status = status;
    ctx.response.body = {
      error,
      status,
      message: error.message,
    };
  }
};
