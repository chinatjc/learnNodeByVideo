var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const RedisStore = require('connect-redis')(session)

var loginCheck = require('./routes/loginCheck');
var blogRouter = require('./routes/blog');
var userRouter = require('./routes/user');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// log
const ENV = process.env.NODE_ENV;

if(ENV !== 'production') {
    app.use(logger('dev'));
} else {
    const logFileName = path.join(__dirname, 'logs', 'access.log');
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    });
    app.use(logger('combined', {
        stream: writeStream
    }));
}

// session
const redisClient = require('./db/redis');
const sessionStore = new RedisStore({
	client: redisClient,
	prefix: '' // redis中的sessionId前缀为空
});
app.use(session({
	name: 'sessionId',
	secret: 'Wn*#1233',
	rolling: true,  // 每次用户请求都重新计算cookie的expires
	resave: false, // 即使未修改，session也会保存到redis
	saveUninitialized: true, // 没有登录的用户，也会设置sessionId到cookie
	cookie: {
		// path: '/',
		// httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000
	},
	store: sessionStore
}));

// check login status
app.use(loginCheck);

app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
