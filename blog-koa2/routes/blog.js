const router = require('koa-router')();
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.prefix('/api/blog');

router.get('/list', async (ctx, next) => {
	const author = ctx.session.username === 'admin' ? '' : ctx.session.username;
	const data = await getList({...ctx.query, author});

	ctx.body = SuccessModel({ data });
});

router.get('/detail', async (ctx, next) => {
	const author = ctx.session.username === 'admin' ? '' : ctx.session.username;
	const data = await getDetail({...ctx.query, author});

	if (data.length) {
		ctx.body = SuccessModel({
			data: data[0]
		});
	} else {
		ctx.body = ErrorModel({
			msg: '未查询到结果'
		});
	}
});

router.post('/new', async (ctx, next) => {
	const createtime = +new Date();
	const author = ctx.session.username;
	const result = await newBlog({...ctx.request.body, createtime, author});

	if (result) {
		ctx.body = SuccessModel({
			data: {},
			msg: '新建博客成功'
		});
	} else {
		ctx.body = ErrorModel({
			msg: '新建博客失败'
		});
	}
});

router.post('/update', async (ctx, next) => {
	const author = ctx.session.username === 'admin' ? '' : ctx.session.username;
	const result = await updateBlog({...ctx.request.body, author});

	if (result) {
		ctx.body = SuccessModel({
			data: {},
			msg: '更新博客成功'
		});
	} else {
		ctx.body = ErrorModel({
			msg: '更新博客失败'
		});
	}
});

router.post('/del', async (ctx, next) => {
	const author = ctx.session.username;
	const result = await delBlog({...ctx.request.body, author});

	if (result) {
		ctx.body = SuccessModel({
			data: {},
			msg: '删除博客成功'
		});
	} else {
		ctx.body = ErrorModel({
			msg: '删除博客失败'
		});
	}
});

module.exports = router;