const { exec } = require('../db/mysql');
const { safetyHandling } = require('../utils/safetyHandling');
const { removeBoundaryQuot } = require('../utils');
const xss = require('xss');

const getList = ({ author, keyword } = {}) => {
	author = safetyHandling(author);
	keyword = safetyHandling(keyword);

	let sql = `select * from blogs where 1=1`;

	if (author) {
		sql += ` and author=${author}`;
	}
	if (keyword) {
		sql += ` and title like '%${removeBoundaryQuot(keyword)}%'`;
	}
	sql += ` order by createtime desc`;

	// 保底返回值为 []
	return exec(sql).then(data => ({
		body: {
			data
		}
	})).catch(e => ({
		body: {
			data: []
		}
	}));
};

const getDetail = ({ id, author }) => {
	id = safetyHandling(id);
	author = safetyHandling(author);

	let sql = `select * from blogs where id=${id}`;

	if (author) {
		sql += ` and author=${author}`;
	}

	return exec(sql).then(data => ({
		body: {
			data: data[0] || {}
		}
	})).catch(e => Promise.reject({
		body: {
			msg: '未查询到结果'
		}
	}));
};

const newBlog = ({ title, content, createtime, author }) => {
	console.log(title);

	title = safetyHandling(title);
	content = safetyHandling(content);
	createtime = safetyHandling(createtime);
	author = safetyHandling(author);

	console.log(title);

	const sql = `insert into blogs (title, content, createtime, author) values (${title}, ${content}, ${createtime}, ${author});`;

	return exec(sql)
		.then(insertData => ({
			body: {
				data: { id: insertData.insertId }
			}
		}))
		.catch(e => Promise.reject({
			body: {
				msg: '新建博客失败'
			}
		}));
};

const updateBlog = ({ id, author, title, content }) => {
	id = safetyHandling(id);
	author = safetyHandling(author);
	title = safetyHandling(title);
	content = safetyHandling(content);

	let sql = `update blogs set title=${title} , content=${content} where id=${id}`;

	if (author) {
		sql += ` and author=${author}`;
	}

	return exec(sql)
		.then(updateData => {
			if (updateData.affectedRows < 1) {
				return Promise.reject();
			}
			return {
				body: {
					data: {},
					msg: '更新博客成功'
				}
			};
		})
		.catch(e => Promise.reject({
			body: {
				msg: '更新博客失败'
			}
		}));
};

const delBlog = ({ id, author }) => {
	id = safetyHandling(id);
	author = safetyHandling(author);

	// 保证 只有author身份可以删除信息
	const sql = `delete from blogs where id=${id} and author=${author};`;

	return exec(sql)
		.then(delData => {
			if (delData.affectedRows < 1) {
				return Promise.reject();
			}
			return {
				body: {
					data: {},
					msg: '删除博客成功'
				}
			};
		})
		.catch(e => Promise.reject({
			body: {
				msg: '删除博客失败'
			}
		}));
};

module.exports = {
	getList,
	getDetail,
	newBlog,
	updateBlog,
	delBlog
};
