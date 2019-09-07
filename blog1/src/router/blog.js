const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog');
const { handlerReturnData } = require('./util');


const map = {
	GET: {
		'/api/blog/list'(req, res) {
			let author = req.session.username === 'admin' ? '' : req.session.username;

			return handlerReturnData(getList, {...req.query, author});
		},
		'/api/blog/detail'(req, res) {
			let author = req.session.username === 'admin' ? '' : req.session.username;

			return handlerReturnData(getDetail, {...req.query, author});
		}
	},
	POST: {
		'/api/blog/new'(req, res) {
			req.body.createtime = +new Date();
			req.body.author = req.session.username;

			return handlerReturnData(newBlog, req.body);
		},
		'/api/blog/update'(req, res) {
			let author = req.session.username === 'admin' ? '' : req.session.username;

			return handlerReturnData(updateBlog, {...req.body, author});
		},
		'/api/blog/del'(req, res) {
			req.body.author = req.session.username;

			return handlerReturnData(delBlog, req.body);
		}
	}
};

module.exports = map;
