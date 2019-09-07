// 去除 escape后字符串的前后引号
const removeBoundaryQuot = str => {
	str = /^'.*/.test(str) ? str.slice(1) : str
	str = /.*'$/.test(str) ? str.slice(0, -1) : str;
	return str;
};


module.exports = {
	removeBoundaryQuot
};
