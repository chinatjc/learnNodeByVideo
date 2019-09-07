const express = require('express');

const app = express();

app.listen(4500, () => {
	console.log('http://localhost:3000');
});


app.get('/api/list', (req, res, next) => {
	console.log('/api/list');
	next();
});

app.use('/api/list', (req, res, next) => {
	console.log('/api');
	res.end('123');
});
