const Koa = require('koa');
const app = new Koa();

app.use(require('./middleware/error-handler'));
app.use(require('./middleware/request-logger'));

app.use(require('./controllers/sleep'));

module.exports = app;
