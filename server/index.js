const Koa = require('koa');
const app = new Koa();

const port = process.env.PORT || 3000

app.use(async ctx => {
  ctx.body = 'Hello World';
});

console.log(`Listening on port ${port}`);
app.listen(port);

