const crypto = require('crypto');

// 密匙
const SECRET_KEY = 'ilqwejklrqwje';

// md5加密
const md5 = content => crypto.createHash('md5').update(content).digest('hex');

const genPassword = password => md5(`password=${password}&key=${SECRET_KEY}`);

module.exports = {
	genPassword
};
