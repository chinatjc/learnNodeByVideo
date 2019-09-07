const http = require('http');
const path = require('path');
const fs = require('fs');

const filename1 = path.resolve(__dirname, 'data.text');
const filename2 = path.resolve(__dirname, 'data-bak.text');

// 复制文件
// const readStream = fs.createReadStream(filename1);
// const writeStream = fs.createWriteStream(filename2);

// readStream.pipe(writeStream);

// readStream.on('data', chunk => {
// 	console.log(+new Date());
// });

// readStream.on('end', () => {
// 	console.log('copy done');
// });

http.createServer((req, res) => {
	fs.createReadStream(filename1).pipe(res);
}).listen(4000)
