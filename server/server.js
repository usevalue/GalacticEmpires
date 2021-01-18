const express = require('express');
const static = express.static;
const http = require('http');
const requestRouter = require('./router.js');


const app = express();


const clientPath = __dirname+'/../client/';
app.set('view engine', 'ejs');
app.set('views', clientPath+'views');
//app.use(static(clientPath));

app.use('/', requestRouter);

const server = http.createServer(app);

server.listen(2000);
