const router = require('koa-router')();
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.prefix('/api/user');

router.post('/login', async (ctx, next) => {
	let {username, password} = ctx.request.body;

	const data = await login({ username, password });

	username = (data || {}).username;

	if (username) {
		ctx.session.username = username
        ctx.session.isLogin = true
		ctx.body = SuccessModel({
			data: {},
			msg: '登陆成功'
		});
	} else {
		ctx.body = ErrorModel({
			msg: '登录失败'
		});
	}
});

module.exports = router;