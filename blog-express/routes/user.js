var express = require('express');
var router = express.Router();
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.post('/login', function(req, res, next) {
	const {username, password} = req.body;

	login({ username, password })
		.then(data => {
			// 设置 session
		    req.session.username = data.username;
		    req.session.isLogin = true;

		    res.json(SuccessModel({ data: data.body }));
		})
		.catch(data => {
			res.json(ErrorModel({ msg: data.body.msg }));
		});
});

module.exports = router;
