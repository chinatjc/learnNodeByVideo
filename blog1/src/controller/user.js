const { exec } = require('../db/mysql');
const { safetyHandling } = require('../utils/safetyHandling');
const { genPassword } = require('../utils/cryp');

const login = ({ username, password }) => {
	username = safetyHandling(username);
	password = `'${genPassword(password)}'`;

	const sql = `select * from users where username=${username} and password=${password}`;

	return exec(sql).then(data => {
		// 返回是否有值，判断登录成功？失败？
		if (data.length === 0)  {
			return Promise.reject();
		}
		return {
			username: data[0].username,
			password: data[0].password,
			body: {
				data: {},
				msg: '登陆成功'
			}
		};
	}).catch(e => Promise.reject({
		body: {
			msg: '登录失败'
		}
	}));
};

module.exports = {
	login
};
