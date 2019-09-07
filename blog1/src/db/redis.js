const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('err', err => {
	console.log(`err: ${err}`);
});

// 测试
const get = (key) => {
	return new Promise((resolve, reject) => {
		redisClient.get(key, (err, value) => {
			// 处理报错的情况
			if (err) {
				reject(err);
				return
			}
			// 处理正常的情况
			if (value === null) {
				resolve(null);
			} else {
				try {
					resolve(JSON.parse(value));
				} catch (err) {
					resolve(value);
				}
			}
		});
	});
};

const set = (key, value) => {
	// 处理对象与字符串的问题
	value = typeof value === 'object' ? JSON.stringify(value) : value;
	redisClient.set(key, value, redis.print);
};

module.exports = {
	redisGet: get,
	redisSet: set
};
