// 模拟express

// app = express();
// app.listen(port[, cb])

// app.use([path, ]fn[, fn1]...)
// app.get(path, fn[, fn1]...)
// app.post(path, fn[, fn1]...)

const http = require('http');

const express = () => {
	const execQueue = [];

	const server = http.createServer((res, req) => {
		const method = res.method;
		const path = res.url.split('?')[0];

		let promise = new Promise((resolve, reject) => {
			resolve();
		});

		execQueue.forEach(execObj => {

			if (method.includes(execObj.method) && execObj.pathReg.test(path)) {

				execObj.fnList.forEach(fn => {
					promise = promise.then(() => {
						return new Promise((resolve, reject) => {
							fn(res, req, () => resolve());
						})
					});
				});
			}
		});
	});

	const obj = {
		listen(port, cb) {
			server.listen(port);
			cb();
		},
		loadingExecQueue({ method = '', pathReg = '', fnList = [] } = {}) {
			execQueue.push({ method, pathReg, fnList });
		},
		use(...arg) {
			if (arg.length) {
				const hasPath = arg[0].constructor === String;

				this.loadingExecQueue({
					method: '',
					pathReg: hasPath ? new RegExp(`^${path2RegExp(arg[0])}`) : /^\//,
					fnList: hasPath ? arg.slice(1) : arg
				});
			}
		},
		get(path, ...fnList) {
			if (fnList.length) {
				this.loadingExecQueue({
					method: 'GET',
					pathReg: new RegExp(`^${path2RegExp(path)}$`),
					fnList: fnList
				});
			}
		},
		post(path, ...fnList) {
			if (fnList.length) {
				this.loadingExecQueue({
					method: 'POST',
					pathReg: new RegExp(`^${path2RegExp(path)}$`),
					fnList: fnList
				});
			}
		}
	};

	const path2RegExp = path => {
		return path.replace(/\//g, '\\/');
	};

	return obj;
};

module.exports = express;

// function middlewareA(req, res, next) {
//     console.log('middlewareA before next()', new Date());
//     setTimeout(() => {
// 	    next();
//     }, 20000);
//     console.log('middlewareA after next()', new Date());
// }

// function middlewareB(req, res, next) {
//     console.log('middlewareB before next()', new Date());
//     next();
//     console.log('middlewareB after next()', new Date());
// }

// function middlewareC(req, res, next) {
//     console.log('middlewareC before next()', new Date());
//     next();
//     console.log('middlewareC after next()', new Date());
// }

// function middlewareD(req, res, next) {
//     console.log('middlewareD before next()', new Date());
//     next();
//     res.end('123');
//     console.log('middlewareD after next()', new Date());
// }

// app.use(middlewareA);
// app.use(middlewareB);
// app.use(middlewareC, middlewareD);
