const mysql = require('mysql');

// 创建链接对象
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'mymm1234',
	port: '3306',
	database: 'myblog'
});

// 开始连接
connection.connect();

// 执行 sql 语句
const sql = 'select * from users\;';

connection.query(sql, (err, result) => {
	if (err) {
		return console.log('err, ', err);
	}
	console.log(JSON.stringify(result));
});

// 结束连接
connection.end();
