const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

// 创建链接对象
const connection = mysql.createConnection(MYSQL_CONF);

// 开始连接
connection.connect();

// 执行 sql 语句
const exec = sql => {
	return new Promise((resolve, reject) => {
		connection.query(sql, (err, result) => {
			if (err) {
				return reject(err);
			}
			resolve(result);
		});
	});
};

module.exports = {
	exec
};
