// Libraries
const express = require('express');
const static = express.static;
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');

// My modules
const requestRouter = require('./router.js');

// Database
const dburl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/onsolarsails';
mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true});

// Server set-up
const app = express();
const clientPath = path.join(__dirname, '/../client/');
app.use(static(clientPath));
app.set('view engine', 'ejs');
app.set('views', path.join(clientPath,'views/'));
app.use('/', requestRouter);

const server = http.createServer(app);
server.listen(2000, () => {
    console.log("Server running.");
});
