const http = require('http');
const app = require('../app');

const port = 3000;

http.createServer(app).listen(port);

console.log(`\nlisten: http://localhost:${port}\n`);
