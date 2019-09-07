var express = require('express');
var router = express.Router();
const { handlerReturnData } = require('./util');
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog');

/* GET users listing. */
router.get('/list', function(req, res, next) {
	const author = req.session.username === 'admin' ? '' : req.session.username;
	handlerReturnData(getList, {...req.query, author}).then(({body}) => {
		res.json(body);
	});
});

router.get('/detail', function(req, res, next) {
	const author = req.session.username === 'admin' ? '' : req.session.username;
	handlerReturnData(getDetail, {...req.query, author}).then(({body}) => {
		res.json(body);
	});
});

router.post('/new', function(req, res, next) {
	req.body.createtime = +new Date();
	req.body.author = req.session.username;
	handlerReturnData(newBlog, req.body).then(({body}) => {
		res.json(body);
	});
});

router.post('/update', function(req, res, next) {
	const author = req.session.username === 'admin' ? '' : req.session.username;
	handlerReturnData(updateBlog, {...req.body, author}).then(({body}) => {
		res.json(body);
	});
});

router.post('/del', function(req, res, next) {
	req.body.author = req.session.username;
	handlerReturnData(delBlog, req.body).then(({body}) => {
		res.json(body);
	});
});

module.exports = router;
