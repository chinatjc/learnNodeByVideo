const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fullName = path.join(__dirname, '../../logs/', 'access.log');

// 分析日志，逐行读取
const readStream = fs.createReadStream(fullName);

const rl = readline.createInterface({
	input: readStream
});

let chrome = 0;
let sum = 0;

// 统计
rl.on('line', (lineData) => {
	if (!lineData) {
		return;
	}

	sum++;

	if ((lineData.split('--')[2] || '').includes('Chrome')) {
		chrome++;
	}
})

rl.on('close', () => {
	console.log(`chrome 占比：${(chrome / sum * 100).toFixed(2)} %`);
});
