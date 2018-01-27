const _ = require('lodash');
const bunyan = require('bunyan');

module.exports = bunyan.createLogger({
  name: 'demo-service',
  serializers: {
    error: serialiseError,
    err: serialiseError,
  },
});

// error serialisation to preserve stack and any additional error keys
function serialiseError(error) {
  const result = _.pick(error, [ 'name', 'message', 'stack' ]);
  Object.keys(error).forEach(key => result[key] = error[key]);
  return result;
}
