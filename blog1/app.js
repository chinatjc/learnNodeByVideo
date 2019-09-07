const querystring = require('querystring');
const { redisGet, redisSet } = require('./src/db/redis');
const { loginApiUrl } = require('./src/conf/url');
const router = require('./src/router');
const { accessLog } = require('./src/utils/log');

const app = (req, res) => {
	// ------------------------ 写入日志 ------------------------
	accessLog(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${+new Date()}`);

	// ------------------------ 解析请求 ------------------------

	// 解析path
	req.path = req.url.split('?')[0];

	// 解析query
	req.query = querystring.parse(req.url.split('?')[1]);

	// 解析cookie
	req.cookie = (req.headers.cookie || '').split('\; ').reduce((cookieMap, item) => {
		const [key, value] = item.split('=');
		cookieMap[decodeURIComponent(key)] = decodeURIComponent(value);
		return cookieMap;
	}, {});

	Promise.all([
		// 解析 session （使用redis）
		new Promise((resolve, reject) => {
			// 如果是登录api sessionId重置
			req.sessionId = req.path === loginApiUrl && req.cookie.sessionId ? '' : req.cookie.sessionId;
			if (req.sessionId) {
				// 有sessionId
				redisGet(req.sessionId).then(sessionData => {
					if (Object.prototype.toString.call(sessionData) === '[object Object]') {
						// 有对应的sessionData
						req.session = sessionData;
					} else {
						// 无对应的sessionData
						req.session = {};
						redisSet(req.sessionId, req.session);
					}
					resolve();
				});
			} else {
				// 无sessionId
				// 新建sessionId、session
				req.sessionId = `${+new Date()}_${Math.round(Math.random() * 10000)}`;
				req.session = {};
				redisSet(req.sessionId, {});
				resolve();
			}
		}),
		// 处理 post data
		new Promise((resolve, reject) => {
			if (req.method === 'POST' && req.headers['content-type'] === 'application/json') {
				// 处理 post data
				let postData = '';

				req.on('data', chunk => {
					postData += chunk.toString();
				});

				req.on('end', () => {
					req.body = postData ? JSON.parse(postData) : {};
					resolve();
				});
			} else {
				resolve();
			}
		})
	])
	.then(() => {
		// ------------------------ 处理请求 ------------------------

		return new Promise((resolve, reject) => {
			let responseHead = {code: 200, options: { 'content-type': 'application/json' }};
			let responseBody = {};

			// error 1  success
			// error 0  error
			// error -1 404
			// error -2 relogin

			// 404，不符合api method & url 的规定
			if (!router[req.method] || !router[req.method][req.path]) {
				responseHead.code = 404;
				responseBody.errno = -1;
				return resolve({responseHead, responseBody});
			}
			// 未登录
			if (req.path !== loginApiUrl && !req.session.username) {
				responseBody.errno = -2;
				return resolve({responseHead, responseBody});
			}

			// processing api
			router[req.method][req.path](req, res)
				.then(data => {
					responseHead.code = data.head && data.head.code || responseHead.code;
					responseHead.options = Object.assign(responseHead.options, data.head && data.head.options || {});
					responseBody = data.body || responseBody;
					resolve({responseHead, responseBody});
				});
		});
	})
	.then(({responseHead, responseBody}) => {
		// ------------------------ 返回响应 ------------------------

		res.writeHead(responseHead.code, responseHead.options);
		res.end(JSON.stringify(responseBody));
	});
};

module.exports = app;
