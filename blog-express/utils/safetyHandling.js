const mysql = require('mysql');
const xss = require('xss');

// 输入安全处理
const safetyHandling = value => {
	if (typeof value === 'string') {
		value = mysql.escape(value);
		value = xss(value);
	}
	return value;
};

module.exports = {
	safetyHandling
};
