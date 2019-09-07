const http = require('http');

http.createServer((req, res) => {
	if (req.url.includes('/err')) {
		1();
	}

	console.log('lalalala');
	console.error('wuwuwuwu');
	res.end('hello world2345');
}).listen(6789, () => {
	console.log('\nlocalhost:6789\n');
});
