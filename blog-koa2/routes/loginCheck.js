const { ErrorModel } = require('../model/resModel');
const { loginApiUrl } = require('../conf/url');

const loginCheck = async (ctx, next) => {
	if (ctx.path === loginApiUrl || ctx.session.username) {
		await next();
		return
	}
	ctx.body = ErrorModel({ msg: '无权限' })
};

module.exports = loginCheck;
