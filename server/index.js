
// node dependencies
const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

// libs
const Koa = require('koa');
const helmet = require('koa-helmet');
const Router = require('koa-router');
const serve = require('koa-static');

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

/**
 * Generic function to render index file
 */
const renderIndex = async (ctx, next) => {
  try {
    ctx.body = await readFile(path.join(__dirname, '../client/index.html'), 'utf-8');
    return next();
  } catch (e) {
    logger.error({exception: e});
    ctx.body = 'Error!';
    throw e;
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

router.get('/', renderIndex);

// static files
const static_files_path = path.join(__dirname, '/../client');
app.use(serve(static_files_path));


// routes
app.use(router.routes());
app.use(router.allowedMethods());


const server = app.listen(config.port, config.host, () => {
  console.log(`${config.name} running on ${config.protocol}:\/\/${config.host}:${config.port}`);
});

server.on('error', errorHandler);

module.exports = app;

