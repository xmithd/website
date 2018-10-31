
// node dependencies
const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

// libs
const Koa = require('koa');
const helmet = require('koa-helmet');
const Router = require('koa-router');


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

const router = new Router();

app.use(helmet());
app.use(requestId());

app.use(logMiddleware({ logger }));
/*app.use(async ctx => {
  ctx.body = 'Hello World';
});*/

router.get('/', async (ctx, next) => {
  try {
    ctx.body = await readFile(path.join(__dirname, '../client/index.html'), 'utf-8');
    next();
  } catch (e) {
    logger.error({exception: e});
    ctx.body = 'Error!';
    throw e;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(config.port, config.host, () => {
  console.log(`${config.name} running on ${config.protocol}:\/\/${config.host}:${config.port}`);
});

server.on('error', errorHandler);


module.exports = app;

