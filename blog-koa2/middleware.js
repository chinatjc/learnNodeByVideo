// 洋葱模型
// 根据next，决定是否执行下一个中间件


const http = require('http');

class Koa {
	constructor () {
		this.execQueue = [];
		this.server = http.createServer(async (req, res) => {
			let i = 0;

			const ctx = {
				request: req,
				response: res,
				method: req.method,
				url: req.url,
				header: {},
				set(key, value) {
					this.header[key] = value;
				}
			};

			const next = async() => this.execQueue[i] && await this.execQueue[i++](ctx, next);
			await next();

			if (ctx.body && ctx.body.constructor === Object) {
				res.writeHead(200, {...ctx.header, 'content-type': 'application/json'});
				res.end(JSON.stringify(ctx.body));
			}

			if (ctx.body && ctx.body.constructor === String) {
				res.writeHead(200, {...ctx.header, 'content-type': 'text/plain'});
				res.end(ctx.body);
			}
		});
	}

	listen(...arg) {
		this.server.listen(...arg);
	}

	use(fn) {
		this.execQueue.push(fn);
	}
};

const app = new Koa();

app.listen(4500, () => {
	console.log('\nlocalhost:4500\n');
});

// logger

app.use(async (ctx, next) => {
  await next();
  // const rt = ctx.response.get('X-Response-Time');
  const rt = 123;
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World';
});

