
// libs
const Koa = require('koa');
const helmet = require('koa-helmet');

// our dependencies
const logger = require('./logger');
const config = require('./config');

// our middleware
const requestId = require('./middlewares/requestId');
const logMiddleware = require('./middlewares/log');


// logic starts here

// generic error handler
function errorHandler(err, ctx) {
  if (ctx === null) {
    logger.error( {err, event: 'error'}, 'Unhandled exception occured!');
  }
}

const app = new Koa();

app.use(helmet());
app.use(requestId());

app.use(logMiddleware({ logger }));
app.use(async ctx => {
  ctx.body = 'Hello World';
});

const server = app.listen(config.port, config.host, () => {
  console.log(`${config.name} running on ${config.protocol}:\/\/${config.host}:${config.port}`);
});

server.on('error', errorHandler);


module.exports = app;

