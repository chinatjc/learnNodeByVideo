const { ErrorModel } = require('../model/resModel');
const { loginApiUrl } = require('../conf/url');

const loginCheck = (req, res, next) => {
	if (req.path === loginApiUrl || req.session.isLogin) {
		next();
		return;
	}
	res.json(ErrorModel({ msg: '未登录' }));
};

module.exports = loginCheck;
