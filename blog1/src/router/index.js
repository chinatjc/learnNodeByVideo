const blogMap = require('./blog');
const userMap = require('./user');

const map = [blogMap, userMap].reduce((map, childMap) => {
	['GET', 'POST'].map(method => {
		map[method] = map[method] || {};
		Object.assign(map[method], childMap[method] ? childMap[method] : {});
	});

	return map;
}, {});

module.exports = map;
