const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const morgan = require('koa-morgan');
const path = require('path');
const fs = require('fs');

const loginCheck = require('./routes/loginCheck');
const blog = require('./routes/blog');
const user = require('./routes/user');

const { REDIS_CONF } = require('./conf/db');

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// log
const ENV = process.env.NODE_ENV;

if(ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    const logFileName = path.join(__dirname, 'logs', 'access.log');
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    });
    app.use(morgan('combined', {
        stream: writeStream
    }));
}

app.keys = ['Wn*#1233'];
app.use(session({
	cookie: {
        // path: '/',
        // httpOnly: true,
        // maxAge: 24 * 60 * 60 * 1000
    },
    store: redisStore({
        host: REDIS_CONF.host,
        port: REDIS_CONF.port
    })
}));

// loginCheck
app.use(loginCheck);

// routes
app.use(blog.routes(), blog.allowedMethods());
app.use(user.routes(), user.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
