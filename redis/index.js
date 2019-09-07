const redis = require('redis');

// 创建客户端
const redisClient = redis.createClient(6379, '127.0.0.1');
redisClient.on('err', err => {
	console.log(`err: ${err}`);
});

// 测试
// redisClient.set('name', 'Mike', redis.print);
redisClient.set('age', 29, redis.print);
redisClient.get('age', (err, value) => {
	if (err) {
		console.log(`get Key: ${err}`);
		return
	}
	console.log(`value: ${value}`);
	redisClient.quit();
});
