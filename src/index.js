const processStartTime = Date.now();

const logger = require('./logger');
const app = require('./app');
const PORT = process.env.PORT || 8000;

module.exports = app.listen(PORT, () => {
  logger.info({
    startupDurationMs: Date.now() - processStartTime,
    port: PORT,
  }, 'Server started');
});

