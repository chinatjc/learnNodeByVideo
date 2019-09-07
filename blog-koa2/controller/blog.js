const { exec } = require('../db/mysql');
const { safetyHandling } = require('../utils/safetyHandling');
const { removeBoundaryQuot } = require('../utils');
const xss = require('xss');

const getList = async ({ author, keyword } = {}) => {
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
	const data = await exec(sql);

	return data;
};

const getDetail = async ({ id, author }) => {
	id = safetyHandling(id);
	author = safetyHandling(author);

	let sql = `select * from blogs where id=${id}`;

	if (author) {
		sql += ` and author=${author}`;
	}

	const data = await exec(sql);

	return data;
};

const newBlog = async ({ title, content, createtime, author }) => {
	title = safetyHandling(title);
	content = safetyHandling(content);
	createtime = safetyHandling(createtime);
	author = safetyHandling(author);

	const sql = `insert into blogs (title, content, createtime, author) values (${title}, ${content}, ${createtime}, ${author});`;

	const data = await exec(sql);

	return data.affectedRows > 0 ? true : false;
};

const updateBlog = async ({ id, author, title, content }) => {
	id = safetyHandling(id);
	author = safetyHandling(author);
	title = safetyHandling(title);
	content = safetyHandling(content);

	let sql = `update blogs set title=${title} , content=${content} where id=${id}`;

	if (author) {
		sql += ` and author=${author}`;
	}

	const data = await exec(sql);

	return data.affectedRows > 0 ? true : false;
};

const delBlog = async ({ id, author }) => {
	id = safetyHandling(id);
	author = safetyHandling(author);

	// 保证 只有author身份可以删除信息
	const sql = `delete from blogs where id=${id} and author=${author};`;

	const data = await exec(sql);

	return data.affectedRows > 0 ? true : false;
};

module.exports = {
	getList,
	getDetail,
	newBlog,
	updateBlog,
	delBlog
};
