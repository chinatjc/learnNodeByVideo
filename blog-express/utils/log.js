const path = require('path');
const fs = require('fs');

function writeLog(writeStream, log) {
	writeStream.write(`${log}\n\n`);
}

function createWriteStream(filename) {
	const fullname = path.join(__dirname, '../../logs/', filename);
	const writeStream = fs.createWriteStream(fullname, {
		flags: 'a'
	});
	return writeStream;
}

const accessWriteStream = createWriteStream('access.log');

function accessLog(log) {
	writeLog(accessWriteStream, log);
}

module.exports = {
	accessLog
};
