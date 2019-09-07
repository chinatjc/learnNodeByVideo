const fs =require('fs');
const path =require('path');

const filename = path.resolve(__dirname, 'data.text');

// 读取文件
// fs.readFile(filename, (err, data) => {
// 	if (err) {
// 		return console.error(err);
// 	}
// 	console.log(data.toString());
// });


// 写入文件
// const content = '\n这是新写入的内容';
// const opt = {
// 	flag: 'a' // a为追加内容
// };

// fs.writeFile(filename, content, opt, (err) => {
// 	console.error(err);
// });

// 文件是否存在
fs.exists(filename, (exist) => {
	console.log(`exist: ${exist}`);
})
