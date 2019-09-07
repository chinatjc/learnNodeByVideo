const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

// 创建客户端
const redisClient = redis
	.createClient(REDIS_CONF.port, REDIS_CONF.host)
	.on('err', err => {
		console.log(`err: ${err}`);
	});

module.exports = redisClient;
