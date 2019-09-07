const { exec } = require('../db/mysql');
const { safetyHandling } = require('../utils/safetyHandling');
const { genPassword } = require('../utils/cryp');

const login = async ({ username, password }) => {
	username = safetyHandling(username);
	password = `'${genPassword(password)}'`;

	const sql = `select * from users where username=${username} and password=${password}`;

	const data = await exec(sql);

	return data[0];
};

module.exports = {
	login
};
