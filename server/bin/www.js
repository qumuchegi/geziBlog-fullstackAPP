let app = require('../app');
let http = require('http')

var server = http.createServer(app);
server.listen(3001,console.log('正在监听3001'));
 
 