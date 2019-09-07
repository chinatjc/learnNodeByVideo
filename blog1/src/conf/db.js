const env = process.env.NODE_ENV;

let MYSQL_CONF = {
	host: 'localhost',
	user: 'root',
	password: 'mymm1234',
	port: '3306',
	database: 'myblog'
};

let REDIS_CONF = {
	host: 'localhost',
	port: '6379'
};

if (env === 'dev') {
	MYSQL_CONF = Object.assign(MYSQL_CONF, {});
}

if (env === 'production') {
	MYSQL_CONF = Object.assign(MYSQL_CONF, {});
}

module.exports = {
	MYSQL_CONF,
	REDIS_CONF
};
